import React, { Component, useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { darken } from 'polished';
import { StopProps, StopInfo, Trip, TripUpdate } from './types';
import styled from 'styled-components';
import { useInterval } from './useinterval';

function Stop({ match }: StopProps) {
  const [info, setInfo] = useState<StopInfo>(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [realtime, setRealtime] = useState<{ [tripId: string]: TripUpdate }>(
    {}
  );
  const [now, setNow] = useState();
  useEffect(() => {
    const fetchData = async () => {
      setInfoLoading(true);
      setTripsLoading(true);
      const res1 = await fetch(`/au-syd/station/${match.params.stopId}`);
      const info = await res1.json();
      setInfo(info);
      setInfoLoading(false);
      const res2 = await fetch(`/au-syd/station/${match.params.stopId}/times`);
      const trips = await res2.json();
      setTrips(trips.trips);
      setTripsLoading(false);
    };
    fetchData();
  }, [match.params.stopId]);
  useInterval(async () => {
    getRealtime();
  }, 15 * 1000);
  const getRealtime = async () => {
    const res = await fetch(`/au-syd/realtime`, {
      method: 'POST',
      body: JSON.stringify({ trips: trips.map(trip => trip.trip_id) }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const realtime = await res.json();
    const now = new Date();
    const then = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );
    const diff = now.getTime() - then.getTime();
    setNow(diff);
    setRealtime(realtime);
  };
  if (infoLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
  if (!infoLoading && !tripsLoading && info !== null && trips !== null) {
    const blocks: { [blockId: string]: Trip[] } = {};
    for (const trip of trips) {
      if (Object.prototype.hasOwnProperty.call(blocks, trip.block_id)) {
        blocks[trip.block_id].push(trip);
      } else {
        blocks[trip.block_id] = [trip];
      }
    }
    const newTrips = trips
      .filter(trip => trip.pickup_type === 0)
      .map(trip => {
        const r = realtime[trip.trip_id];
        const split = trip.trip_id.split('.');
        const departure = new Date(trip.departure_time_seconds * 1000);
        let update;
        let cancelled = false;
        if (r) {
          const rel = r.trip.scheduleRelationship;
          if (rel === 'SCHEDULED') {
            const found = r.stopTimeUpdate.find(
              stu => stu.stopId === match.params.stopId
            );
            if (found) {
              update = found;
              departure.setSeconds(
                departure.getSeconds() + found.departure.delay
              );
            }
          }
          if (rel === 'CANCELED') {
            cancelled = true;
          }
        }

        const departureTime = `${departure.getUTCHours()}:${departure
          .getUTCMinutes()
          .toString()
          .padStart(2, '0')}:${departure
          .getUTCSeconds()
          .toString()
          .padStart(2, '0')}`;
        const arrival = new Date(trip.arrival_time_seconds * 1000);
        const arrivalTime = `${arrival.getUTCHours()}:${arrival
          .getUTCMinutes()
          .toString()
          .padStart(2, '0')}:${arrival
          .getUTCSeconds()
          .toString()
          .padStart(2, '0')}`;
        const status = cancelled
          ? 'Cancelled'
          : update
          ? update.arrival.delay === 0
            ? 'On time'
            : update.departure.delay > 0
            ? `${Math.ceil(update.departure.delay / 60)} minutes late`
            : `${Math.ceil(
                Math.abs(update.departure.delay / 60)
              )} minutes early`
          : '';
        return {
          ...trip,
          departureTime,
          arrivalTime,
          status,
          split,
          arrival,
          departure
        };
      })
      .sort((a, b) => {
        if (a.arrival_time_seconds < b.arrival_time_seconds) {
          return -1;
        }
        if (a.arrival_time_seconds > b.arrival_time_seconds) {
          return 1;
        }
        return 0;
      });
    return (
      <div>
        <h1>{info.stop_name}</h1>
        <table>
          <thead>
            <tr>
              <th>route</th>
              <th>trip</th>
              <th>run number</th>
              <th>set</th>
              {/* <th>arriving</th> */}
              <th>departing</th>
              <th>link</th>
              <th>delay</th>
            </tr>
          </thead>
          <tbody>
            {newTrips.map(trip => {
              return (
                <TripRow
                  bgColor={trip.route_color}
                  passed={trip.departure.getTime() < now}
                >
                  <td>{trip.route_short_name}</td>
                  <td>{trip.trip_headsign}</td>
                  <td>{trip.split[0]}</td>
                  <td>
                    {trip.split[4]}
                    {trip.split[5]}
                  </td>
                  {/* <td>{arrivalTime}</td> */}
                  <td>{trip.departureTime}</td>
                  <td>
                    <Link to={`/trip/${trip.trip_id}`}>link</Link>
                  </td>
                  <td>{trip.status}</td>
                </TripRow>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

export default withRouter(Stop);

const TripRow = styled.tr<{ bgColor: string; passed: boolean }>`
  background-color: ${props =>
    props.passed ? darken(0.1)(props.bgColor) : props.bgColor};
  color: white;
`;
