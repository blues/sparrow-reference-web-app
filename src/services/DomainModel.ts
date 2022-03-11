// Do not assume you can reach every gateway, node, sensor, or reading starting
// from an object you're looking at. A QueryFilter is probably in effect which
// has limited the extent to which we have populated objects into memory. For
// example, if you're working with recent data from the 'Black Pearl' node you
// might have info about the Gateway, but just the said node and a few days of
// readings. You'll find `undefined` at the points in the tree that we don't
// care about in the context of an active QueryFilter.

// The convention is that fields that are entirely optional (and may be absent) are 
// marked with ?.  Fields that may have undefined values (e.g. no name set) can also be null.


export interface GatewayID {
  readonly type: "GatewayID";

  /**
   * The natural key for this gateway device, corresponding to the notehub Notecard DeviceUID.
   */
  readonly gatewayDeviceUID: string;
}


export interface NodeID {
  readonly type: "NodeID";

  /**
   * The natural key for this Node device, the Node ID, which is the Deivce EUI
   */
  readonly nodeID: string;
}


export interface SensorTypeID {
  readonly type: "SensorTypeID";
}

export interface ProjectID {
  readonly type: "ProjectID";
  readonly projectUID: string;
}

export interface Project {
  readonly id: ProjectID;

  // Attributes
  name: string;
  description: string | null;
  // Links
  gateways?: Set<Gateway>;
}

export interface SensorHost {
  // Attributes
  name: string | null;
  descriptionBig: string | null;
  descriptionSmall: string | null;
  // Links
  sensors?: Set<Sensor>;
}

// todo - doesn't belong here, but in a location dedicated to sensor formats.
export interface Location {
  name: string;
  country: string;
}

export interface Gateway extends SensorHost {
  readonly id: GatewayID; // Reference across the whole system architecture
  // Attributes
  lastSeen?: Date | null;
  // Links
  nodes?: Set<Node>;
}

export type LocationOLC = string;
export interface Node extends SensorHost {
  readonly id: NodeID;
  // Attributes
  locationForMachines?: LocationOLC;
  locationForHumans?: string;
  // Links
  // gateway: Gateway;
}

/**
 * Describes a source of readings, aka a Sensor. All readings are of the same type.
 */
export interface Sensor {
  // Links
  sensorHost: SensorHost;
  sensorType: SensorType;

  // can add other instance-specific details here.

}

/**
 * Describes a point-in-time slice through the readings for a SensorHost. 
 */
export interface SensorHostReadingsSnapshot {
  sensorHost: SensorHost;
  readings: Map<SensorType, Reading>;
}

export interface SensorHostReadingsSeries {
  from: Date;
  to: Date;
  readings: Map<SensorType, Set<Reading>>;
}

export interface SensorType {
  readonly id: SensorTypeID;      // todo - do we really need the ID here? let's add it when it's needed.

  // Attributes
  measure: string;    // Temperature, etc.
  name: string;       // Outdoor Temperature, etc.
  unit: string | null; // Kelvin, Million, etc.
  unitSymbol: string | null; // K, M, etc. null for no inut

  spec: JSONObject;
  

  // todo - how about including the json schema for the expected value?
  // should we handle simple numeric values as a very common special case?
}

export interface Reading {
  when: Date;

  // Attributes
  value: JSONObject;

  // todo - how do clients know what to do with "value", or what its expected structure is.

  // The simple numeric value for this sensor for simple numeric readings. This is too common a case for us to ignore and
  // makes handling simple numeric values much easier. (No need to reach into the json on some arbitrary key.)
  numericValue?: number | null;

  // Links
  // sensorType: SensorType;   // todo - do we need both sensorType and sensor?
  // sensor: Sensor;
}

export type JSONObject = { [key in string]?: JSONValue };

export type JSONValue =
  | null
  | string
  | number
  | boolean
  | JSONObject
  | Array<JSONValue>;

