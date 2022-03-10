// Do not assume you can reach every gateway, node, sensor, or reading starting
// from an object you're looking at. A QueryFilter is probably in effect which
// has limited the extent to which we have populated objects into memory. For
// example, if you're working with recent data from the 'Black Pearl' node you
// might have info about the Gateway, but just the said node and a few days of
// readings. You'll find `undefined` at the points in the tree that we don't
// care about in the context of an active QueryFilter.

export interface GatewayID {
  type: "GatewayID";
}
export interface NodeID {
  type: "NodeID";
}
export interface SensorTypeID {
  type: "SensorTypeID";
}

export interface Project {
  // Attributes
  name: string;
  description: string;
  // Links
  gateways?: Set<Gateway>;
}

export interface SensorHost {
  // Attributes
  name: string;
  descriptionBig: string;
  descriptionSmall: string;
  // Links
  sensors?: Set<Sensor>;
}

export interface Gateway extends SensorHost {
  readonly id: GatewayID; // Reference across the whole system architecture
  // Attributes
  locationForMachines?: LocationOLC;
  lastSeen?: Date;
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
  gateway: Gateway;
}

export interface Sensor {
  // Links
  node: Node;
  readings?: Set<Reading>;
  sensorType: SensorType;
}

export interface SensorType {
  readonly id: SensorTypeID;
  // Attributes
  measure: string; // Temperature, etc.
  name: string; // Outdoor Temperature, etc.
  unit: string; // Kelvin, Million, etc.
  unitSymbol: string; // K, M, etc.
}

export interface Reading {
  // Attributes
  value: JSONValue;
  timestamp: Date;
  // Links
  sensorType: SensorType;
  sensor: Sensor;
}

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;
