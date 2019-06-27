import React, { Component, useState, useEffect } from 'react';

import { withRouter, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { StopProps, StopInfo, Trip } from './types';
import TripItem from './trip';

function Stop({ match }: StopProps) {
  const [info, setInfo] = useState<StopInfo>(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(false);
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
  console.log(info, infoLoading);
  if (infoLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
  if (!infoLoading && !tripsLoading && info !== null && trips !== null) {
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
              <th>arriving</th>
              <th>departing</th>
              <th>link</th>
            </tr>
          </thead>
          <tbody>
            {trips.map(trip => {
              console.log(trip);
              const split = trip.trip_id.split('.');
              const departure = new Date(trip.departure_time_seconds * 1000);
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
              return (
                <tr>
                  <td>{trip.route_short_name}</td>
                  <td>{trip.route_long_name}</td>
                  <td>{split[0]}</td>
                  <td>
                    {split[4]}
                    {split[5]}
                  </td>
                  <td>{arrivalTime}</td>
                  <td>{departureTime}</td>
                  <td>
                    <Link to={`/trip/${trip.trip_id}`}>link</Link>
                  </td>
                </tr>
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
