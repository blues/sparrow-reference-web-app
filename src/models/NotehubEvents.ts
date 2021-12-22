interface NotehubEvents {
  latest_events: [
    file: string,
    captured: string,
    received: string,
    event_uid: string,
    body: any // todo fix this
  ];
}

export default NotehubEvents;
