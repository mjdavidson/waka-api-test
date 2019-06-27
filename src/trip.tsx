import React, { Component, useState, useEffect } from 'react';
import StopTimeItem from './stoptime';
import { ListGroup } from 'reactstrap';
import { RouteComponentProps } from 'react-router';
import { TripProps, StopTime } from './types';
import { Link } from 'react-router-dom';

function Trip({ match }: TripProps) {
  const [times, setTimes] = useState<{
    current: StopTime[];
    next?: StopTime[];
    previous?: StopTime[];
  }>({ current: [] });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/au-syd/stop-times/${match.params.tripId}`);
      const data = await res.json();
      setTimes(data);
      setLoading(false);
    };
    fetchData();
  }, [match.params.tripId]);
  const {
    params: { tripId }
  } = match;

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
  console.log();
  if (times !== null && times.current.length > 0) {
    const previous = times.previous;
    const next = times.next;
    const current = times.current;
    return (
      <div style={{ maxWidth: '500px' }}>
        <h1>
          Trip: {current[0].route_short_name} {current[0].trip_headsign}
        </h1>

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
          {current.map(stopTime => (
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
