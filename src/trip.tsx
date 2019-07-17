import React, { useState, useEffect } from 'react';
import { ListGroup } from 'reactstrap';
import {
  TripProps,
  StopTime,
  RouteInfo,
  TripUpdate,
  extendedstoptime
} from './types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useInterval } from './useinterval';
import StopTimeItem from './stoptime';

function Trip({ match }: TripProps) {
  const [times, setTimes] = useState<{
    current: StopTime[];
    next?: StopTime[];
    previous?: StopTime[];
    routeInfo?: RouteInfo;
  }>({ current: [] });
  const [loading, setLoading] = useState(false);
  const [realtime, setRealtime] = useState<{ [tripId: string]: TripUpdate }>(
    {}
  );
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(
        `/${match.params.region}/stop-times/${match.params.tripId}`
      );
      const data = await res.json();
      setTimes(data);
      setLoading(false);
    };
    fetchData();
  }, [match.params.region, match.params.tripId]);

  useInterval(async () => {
    getRealtime();
  }, 3000);

  const getRealtime = async () => {
    const res = await fetch(`/${match.params.region}/realtime`, {
      method: 'POST',
      body: JSON.stringify({ trips: [match.params.tripId] }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const realtime = await res.json();
    setRealtime(realtime);
  };

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  let info: extendedstoptime[] = times.current;
  console.log(realtime[match.params.tripId]);
  if (realtime[match.params.tripId]) {
    info = info.map(stopTime => {
      const s = stopTime;

      const stu = realtime[match.params.tripId].stopTimeUpdate.find(
        update => update.stopId === stopTime.stop_id
      );
      if (stu) {
        Object.assign(s, {
          arrival: stu.arrival.delay,
          departure: stu.arrival.delay
        });
      }
      console.log(s);
      return s;
    });
  }
  if (times !== null && times.current.length > 0) {
    const { previous, next, current, routeInfo } = times;
    const first = current[0];
    return (
      <div style={{ maxWidth: '500px' }}>
        {routeInfo && (
          <h1>
            Trip:{' '}
            <RouteIcon
              bgColor={routeInfo.route_color}
              textColor={routeInfo.route_text_color}
            >
              {routeInfo.route_short_name}
            </RouteIcon>{' '}
            {routeInfo.route_long_name}
          </h1>
        )}

        {previous && previous[0] && (
          <Link to={`/trip/${previous[0].trip_id}`}>
            <h2>previous trip:</h2>
            {previous[0].trip_headsign}
          </Link>
        )}
        {next && next[0] && (
          <Link to={`/trip/${next[0].trip_id}`}>
            <h2>next trip:</h2>
            {next[0].trip_headsign}
          </Link>
        )}
        <ListGroup>
          {info.map(stopTime => (
            <StopTimeItem stopTime={stopTime} />
          ))}
        </ListGroup>
      </div>
    );
  }
  return (
    <div>
      <h1>no times</h1>
    </div>
  );
}

export default Trip;

const RouteIcon = styled.div<{ bgColor: string; textColor: string }>`
  background-color: #${props => props.bgColor};
  color: #${props => props.textColor};
`;
