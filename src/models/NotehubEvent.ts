interface NotehubEvent {
  file: string;
  captured: string;
  received: string;
  event_uid: string;
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
  };
}

export default NotehubEvent;
