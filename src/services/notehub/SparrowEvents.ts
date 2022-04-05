import { BasicSparrowEvent, SparrowEvent } from "../SparrowEvent";
import NotehubEvent from "./models/NotehubEvent";
import NotehubLocation from "./models/NotehubLocation";
import NotehubRoutedEvent from "./models/NotehubRoutedEvent";

function eventError(msg: string, event: NotehubRoutedEvent | NotehubEvent) {
  return new Error(msg);
}

export function eventLocation(event: {
  best_location: string;
  best_lat: number;
  best_lon: number;
  best_country: string;
  best_timezone: string;
  when: number;
}): NotehubLocation | undefined {
  return event.best_location
    ? {
        latitude: event.best_lat,
        longitude: event.best_lon,
        // todo - there isn't a `best_when` but `tri_when`.
        when: event.when,
        country: event.best_country,
        timezone: event.best_timezone,
        name: event.best_location,
      }
    : undefined;
}

/**
 * Normalizes an event name (file) that may either be a simple event name or of
 * the format <nodeEUI>#<eventname>.
 *
 * @param file
 * @returns
 */
export function normalizeSparrowEvent(
  file: string,
  note?: string
): NormalizedEventName {
  let eventName: string;
  let nodeID: string | undefined;
  if (note) {
    eventName = file;
    nodeID = note;
  } else {
    const idx = file.indexOf("#");
    if (idx > 0) {
      eventName = file.slice(idx + 1);
      nodeID = file.slice(0, idx);
    } else {
      eventName = file;
      nodeID = note;
    }
  }
  return { eventName, nodeID };
}

export function sparrowEventFromNotehubRoutedEvent(
  event: NotehubRoutedEvent
): SparrowEvent {
  if (!event.device) {
    throw eventError("device is not defined", event);
  }

  if (!event.project.id) {
    throw eventError("project.id is not defined", event);
  }
  const normalized = normalizeSparrowEvent(event.file, event.note);
  const location = eventLocation(event);

  return new BasicSparrowEvent(
    event.project.id,
    event.device,
    new Date(event.when * 1000),
    normalized.eventName,
    normalized.nodeID,
    location,
    event.body,
    event.sn
  );
}

export function sparrowEventFromNotehubEvent(
  event: NotehubEvent,
  projectUID: string
): SparrowEvent {
  if (!event.device_uid) {
    throw eventError("device uid is not defined", event);
  }

  const normalized = normalizeSparrowEvent(event.file, event.note);
  const location =
    event.gps_location || event.triangulated_location || event.tower_location;

  return new BasicSparrowEvent(
    projectUID,
    event.device_uid,
    new Date(event.captured),
    normalized.eventName,
    normalized.nodeID,
    location,
    event.body
  );
}

interface NormalizedEventName {
  eventName: string;
  nodeID?: string;
}

export type { SparrowEvent, NormalizedEventName };
