// Do not assume you can reach every node, sensor, or reading starting from a
// gateway you're looking at. Be mindful that a QueryFilter is probably in
// effect which has limited the extent to which we have populated all the
// objects into memory. For example, if you're working with recent data from the
// 'Black Pearl' node you might have info about the Gateway, but just the one
// node, and a few days of readings. You'll find `Unknown`s at the points in the
// tree that we don't care about in the context of an active Query.

export const unknown = Symbol("Unknown");
export type Unknown = typeof unknown;

// These `...ID` types prevent `let gatewayID = getNodeID()` which would sadly
// compile if each were simply string. Is there an easier way? Is it worth it?
export type GatewayID = { type: "GatewayID"; id: string };
export type NodeID = { type: "NodeID"; id: string };
export type ReadingSchemaID = { type: "ReadingSchemaID"; id: string };

// TODO (carl): So the types don't need to be peppered with `| Unknown`:
//
// - we might be able to make a type like Shallow<Node> that's not guaranteed to
//   link to every other object. I doubt it would be worth the complication.
//
// - we could just use `?` and `| undefined` and explain that undefined means
//   something like "idk" or "Unknown". I just hate comments explaining
//   things when good naming will make semantics obvious. Is it a common enough
//   practice in JS? For example `sensors?: Set<Sensor | undefined>;`

export interface Gateway {
  type: "Gateway"; // For type descrimination and debugging
  readonly id: GatewayID;
  nodes: Set<Node> | Unknown;
}

export interface Node {
  type: "Node";
  readonly id: NodeID;
  gateway: Gateway;
  sensors: Set<Sensor> | Unknown;
  name: string;
  location: string;
  description: string;
}

export interface Sensor {
  type: "Sensor";
  node: Node;
  schema: ReadingSchema;
  readings: Set<Reading> | Unknown;
}

export interface ReadingSchema {
  type: "ReadingSchema";
  readonly id: ReadingSchemaID;
  unit: string; // Kelvin, etc.
  unitSymbol: string; // K, etc.
  name: string; // Outdoor Temperature, etc.
  measure: string; // Temperature, etc.
  systemOfMeasurement: string; // SI, Imperial, US Customary, etc.
}

export interface Reading {
  type: "Reading";
  timestamp: Date;
  value: number | object;
}

////////////////////////////////////////////////////////////////////////////////
// Query Stuff
//
// A user of the website might not 'think' about the following things unless
// they had a way to save favorite queries as first class citizens of the app.
//
// TODO (carl): Should we put these in a separate file because of the above?

export type DateRange = { from: Date; to: Date };

export const doNotCare = Symbol("DoNotCare");
export type DoNotCare = typeof doNotCare;

export type QueryFilter = {
  gatewayID: GatewayID | DoNotCare;
  nodeID: NodeID | DoNotCare;
  readingSchemaID: ReadingSchemaID | DoNotCare;
  readingDateRange: DateRange | DoNotCare;
};

export type QueryItem = Gateway | Node | Sensor | ReadingSchema | Reading;

export interface Query<T extends QueryItem> {
  filter: QueryFilter;
  results: Set<T>;
}
