import { BasicSparrowEvent, SparrowEvent } from "../SparrowEvent";
import NotehubEvent from "./models/NotehubEvent";
import { NotehubLocationAlternatives } from "./models/NotehubLocation";
import NotehubRoutedEvent, {
  NotehubRoutedEventLocationFields,
} from "./models/NotehubRoutedEvent";

export const _health = {
  qo: "_health.qo",
  SENSOR_PROVISION: "sensor-provision",
};

function eventError(msg: string, event: NotehubRoutedEvent | NotehubEvent) {
  return new Error(msg);
}

export function locationAlternativesFromRoutedEvent(
  event: NotehubRoutedEventLocationFields
): NotehubLocationAlternatives {
  const alternatives: NotehubLocationAlternatives = {};
  if (
    event.when &&
    event.best_location &&
    event.best_country &&
    event.best_timezone &&
    event.best_lat &&
    event.best_lon
  ) {
    alternatives.best_location = {
      when: event.when,
      name: event.best_location,
      country: event.best_country,
      timezone: event.best_timezone,
      latitude: event.best_lat,
      longitude: event.best_lon,
    };
  }
  if (
    event.tower_when &&
    event.tower_location &&
    event.tower_country &&
    event.tower_timezone &&
    event.tower_lat &&
    event.tower_lon
  ) {
    alternatives.tower_location = {
      when: event.tower_when,
      name: event.tower_location,
      country: event.tower_country,
      timezone: event.tower_timezone,
      latitude: event.tower_lat,
      longitude: event.tower_lon,
    };
  }
  if (
    event.when &&
    event.where_location &&
    event.where_country &&
    event.where_timezone &&
    event.where_lat &&
    event.where_lon
  ) {
    alternatives.gps_location = {
      when: event.where_when || event.when,
      name: event.where_location,
      country: event.where_country,
      timezone: event.where_timezone,
      latitude: event.where_lat,
      longitude: event.where_lon,
    };
  }
  if (
    event.tri_when &&
    event.tri_location &&
    event.tri_country &&
    event.tri_timezone &&
    event.tri_lat &&
    event.tri_lon
  ) {
    alternatives.triangulated_location = {
      when: event.tri_when,
      name: event.tri_location,
      country: event.tri_country,
      timezone: event.tri_timezone,
      latitude: event.tri_lat,
      longitude: event.tri_lon,
    };
  }
  return alternatives;
}

// N.B.: Noteub defines 'best' location with more nuance than we do here (e.g
// considering staleness). Also this algorthm is copy-pasted in a couple places.
export const bestLocation = (object: NotehubLocationAlternatives) =>
  object.best_location || object.gps_location || object.triangulated_location || object.tower_location;

function bodyAugmentedWithMetadata(
  event: NotehubEvent | NotehubRoutedEvent,
  locations: NotehubLocationAlternatives
) {
  // eslint-disable-next-line prefer-destructuring
  const body: { [key: string]: any } = event.body;
  if (event.file === "_session.qo") {
    body.voltage ??= event.voltage;
    body.temp ??= event.temp;
    body.bars ??= event.bars;
    body.best_location ??= locations.best_location;
    body.gps_location ??= locations.gps_location;
    body.tower_location ??= locations.tower_location;
    body.triangulated_location ??= locations.triangulated_location;
  }
  return body;
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
  note?: string,
  body?: { [key: string]: any }
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
    } else if (
      file === _health.qo &&
      body &&
      body.method === _health.SENSOR_PROVISION &&
      body.text
    ) {
      eventName = file;
      nodeID = body.text as string;
      const rework = body; // avoid no-param-reassign eslint
      rework.provisioned = 1;
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

  if (!event.app) {
    throw eventError("project id is not defined", event);
  }

  const normalized = normalizeSparrowEvent(event.file, event.note, event.body);
  const locations = locationAlternativesFromRoutedEvent(event);
  const location = bestLocation(locations);
  const body = bodyAugmentedWithMetadata(event, locations);

  return new BasicSparrowEvent(
    event.app,
    event.device,
    new Date(event.when * 1000),
    normalized.eventName,
    normalized.nodeID,
    location,
    body,
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

  const normalized = normalizeSparrowEvent(event.file, event.note, event.body);
  const location = bestLocation(event);
  const body = bodyAugmentedWithMetadata(event, event);

  return new BasicSparrowEvent(
    projectUID,
    event.device_uid,
    new Date(event.captured),
    normalized.eventName,
    normalized.nodeID,
    location,
    body
  );
}

interface NormalizedEventName {
  eventName: string;
  nodeID?: string;
}

export type { SparrowEvent, NormalizedEventName };
