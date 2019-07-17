import Long from 'long';
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
  block_id: string;
  pickup_type: number;
  drop_off_type: number;
}

export interface StopMatchParams {
  stopId: string;
  region: string
}

export interface StopProps extends RouteComponentProps<StopMatchParams> { }
export interface HomeProps extends RouteComponentProps<StopMatchParams> { }


export interface TripMatchParams {
  tripId: string;
  region: string
}

export interface TripProps extends RouteComponentProps<TripMatchParams> { }

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

export interface extendedstoptime extends StopTime {
  arrival?: number;
  departure?: number;
}

export interface StopTimeItemProps {
  stopTime: extendedstoptime;
}

export interface UpdateFeedMessage {
  entity: UpdateFeedEntity[];
  header: FeedHeader;
}

export interface PositionFeedMessage {
  entity: PositionFeedEntity[];
  header: FeedHeader;
}

export interface PositionFeedEntity {
  id: string;
  vehicle: VehiclePosition;
}

export interface UpdateFeedEntity {
  id: string;
  tripUpdate: TripUpdate;
}

export interface TripUpdate {
  stopTimeUpdate: StopTimeUpdate[];
  timestamp: Long;
  trip: TripDescriptor;
  vehicle: VehicleDescriptor;
}

export interface StopTimeUpdate {
  departure: StopTimeEvent;
  arrival: StopTimeEvent;
  scheduleRelationship: number;
  stopId: string;
  stopSequence: number;
}

export interface StopTimeEvent {
  delay: number;
  time: Long;
}

export interface TripDescriptor {
  routeId: string;
  scheduleRelationship: 'SCHEDULED' | 'CANCELED';
  startDate: string;
  startTime: string;
  tripId: string;
}

export interface VehicleDescriptor {
  id: string;
  label: string;
  licensePlate: string;
}

export interface FeedHeader {
  gtfsRealtimeversion: string;
  incrementality: number;
  timestamp: Long;
}

export interface VehiclePosition {
  congestionLevel: number;
  position: {
    latitude: number;
    longitude: number;
    bearing?: number;
    speed?: number;
    odometer?: number;
  };
  stopId: string;
  timestamp: Long;
  trip: TripDescriptor;
  vehicle: VehicleDescriptor;
}

export interface RouteInfo {
  route_short_name: string;
  route_long_name: string;
  route_desc: string;
  route_type: number;
  route_color: string;
  route_text_color: string;
}
