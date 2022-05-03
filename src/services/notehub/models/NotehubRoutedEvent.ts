import { SessionMetadata } from "./SessionMetadata";

interface NotehubRoutedEvent extends SessionMetadata {
  file: string;
  when: number;
  device: string;
  note?: string;
  body: unknown;
  sn: string;

  best_location: string;
  best_lat: number;
  best_lon: number;
  best_country: string;
  best_timezone: string;

  best_id: string;
  project: {
    id: string;
  };
}

export default NotehubRoutedEvent;
