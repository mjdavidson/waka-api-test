import { RouteComponentProps } from 'react-router-dom';

export type StopInfo = {
  stop_id: string;
  stop_name: string;
  stop_desc: string;
  stop_lat: number;
  stop_lon: number;
  zone_id: string;
  location_type: number;
  parent_station: string;
  stop_timezone: string;
  wheelchair_boarding: number;
  route_type: number;
} | null;

export interface Trip {
  agency_id: string;
  arrival_time_seconds: number;
  departure_time_seconds: number;
  direction_id: number;
  end_date: string;
  route_color: string;
  route_icon: null;
  route_long_name: string;
  route_short_name: string;
  route_type: number;
  shape_id: string;
  start_date: string;
  stop_id: string;
  stop_name: string;
  stop_sequence: number;
  trip_headsign: string;
  trip_id: string;
}

export interface StopMatchParams {
  stopId: string;
}

export interface StopProps extends RouteComponentProps<StopMatchParams> {}

export interface TripMatchParams {
  tripId: string;
}

export interface TripProps extends RouteComponentProps<TripMatchParams> {}

export interface StopTime {
  trip_id: string;
  pickup_type: number;
  drop_off_type: number;
  arrival_time: Date;
  departure_time: Date;
  stop_id: string;
  stop_name: string;
  trip_headsign: string;
  route_short_name: string;
}

export interface StopTimeItemProps {
  stopTime: StopTime;
}
