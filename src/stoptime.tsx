import React from 'react';
import { Badge, ListGroupItem } from 'reactstrap';
import { StopTimeItemProps } from './types';
export default function StopTimeItem({ stopTime }: StopTimeItemProps) {
  const arrival = new Date(stopTime.arrival_time);
  const departure = new Date(stopTime.departure_time);
  const arrivalTime = `${arrival.getUTCHours()}:${arrival
    .getUTCMinutes()
    .toString()
    .padStart(2, '0')}:${arrival
    .getUTCSeconds()
    .toString()
    .padStart(2, '0')}`;
  const departureTime = `${departure.getUTCHours()}:${departure
    .getUTCMinutes()
    .toString()
    .padStart(2, '0')}:${departure
    .getUTCSeconds()
    .toString()
    .padStart(2, '0')}`;
  return (
    <>
      <ListGroupItem
        color={
          stopTime.drop_off_type === 1 && stopTime.pickup_type === 1
            ? 'secondary'
            : undefined
        }
      >
        <div>{stopTime.stop_name}</div>
        <div>{stopTime.stop_id}</div>
        <div>arrival {arrivalTime}</div>
        <div>departure {departureTime}</div>
        {stopTime.drop_off_type === 1 && stopTime.pickup_type === 0 && (
          <Badge>Pick Up Only</Badge>
        )}

        {stopTime.drop_off_type === 0 && stopTime.pickup_type === 1 && (
          <Badge>Drop Off Only</Badge>
        )}
      </ListGroupItem>
    </>
  );
}
