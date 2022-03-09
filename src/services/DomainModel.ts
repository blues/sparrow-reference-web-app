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
  // Implementation Details
  type: "Project"; // For typescript narrowing and javascript debugging
}

export interface SensorHost {
  name: string;
  description: string;
  sensors?: Set<Sensor>;
  shortDescription: string;
}

export interface Gateway extends SensorHost {
  // Attributes
  locationForMachines: LocationOLC;
  // Links
  nodes?: Set<Node>;
  // Implementation Details
  readonly id: GatewayID; // Reference across the whole system architecture
  type: "Gateway"; // For typescript narrowing and javascript debugging
}

export type LocationOLC = string;
export interface Node extends SensorHost {
  // Attributes
  locationForMachines?: LocationOLC;
  locationForHumans?: string;
  // Links
  gateway: Gateway;
  // Implementation Details
  readonly id: NodeID;
  type: "Node";
}

export interface Sensor {
  // Attributes
  // Links
  node: Node;
  readings?: Set<Reading>;
  schema: SensorType;
  // Implementation Details
  type: "Sensor";
}

export interface SensorType {
  // Attributes
  // TODO (carl) Lean on @buge/ts-units here?
  measure: string; // Temperature, etc.
  name: string; // Outdoor Temperature, etc.
  unit: string; // Kelvin, Million, etc.
  unitSymbol: string; // K, M, etc.
  // Links
  // Implementation Details
  readonly id: SensorTypeID;
  type: "SensorType";
}

export interface Reading {
  // Attributes
  value: JSONValue;
  timestamp: Date;
  // Links
  schema: SensorType;
  sensor: Sensor;
  // Implementation Details
  type: "Reading";
}

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;
