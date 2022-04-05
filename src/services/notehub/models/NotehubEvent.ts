import NotehubLocation from "./NotehubLocation";

interface NotehubEvent {
  file: string;
  captured: string;
  received: string;
  event_uid?: string;
  note?: string;
  uid: string;
  device_uid?: string;
  body: {
    count?: number;
    sensor?: string;
    humidity?: number;
    pressure?: number;
    temperature?: number;
    voltage?: number;
    total?: number;
    text?: string;
    why?: string;
    net_updated?: number;
    net?: object;
    loc?: string;
    name?: string;
  };
  tower_location?: NotehubLocation;
  triangulated_location?: NotehubLocation;
  gps_location?: NotehubLocation;
}

export default NotehubEvent;
