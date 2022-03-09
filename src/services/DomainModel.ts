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
  // Attributes
  name: string;
  description: string;
  shortDescription: string;
  // Links
  nodes: Set<Node> | Unknown;
  // Implementation Details
  readonly id: GatewayID; // Reference across the whole system architecture
  type: "Gateway"; // For typescript narrowing and javascript debugging
}

export interface Node {
  // Attributes
  description: string;
  shortDescription: string;
  locationHref: string;
  locationName: string;
  name: string;
  // Links
  gateway: Gateway;
  sensors: Set<Sensor> | Unknown;
  // Implementation Details
  readonly id: NodeID;
  type: "Node";
}

export interface Sensor {
  // Attributes
  // Links
  node: Node;
  readings: Set<Reading> | Unknown;
  schema: ReadingSchema;
  // Implementation Details
  type: "Sensor";
}

export interface ReadingSchema {
  // Attributes
  measure: string; // Temperature, etc.
  name: string; // Outdoor Temperature, etc.
  systemOfMeasurement: string; // SI, Imperial, US Customary, etc.
  unit: string; // Kelvin, etc.
  unitSymbol: string; // K, etc.
  // Links
  // Implementation Details
  readonly id: ReadingSchemaID;
  type: "ReadingSchema";
}

export interface Reading {
  // Attributes
  value: JSONValue;
  timestamp: Date;
  // Links
  schema: ReadingSchema;
  // Implementation Details
  type: "Reading";
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

// TODO: I don't like that 'JSON', an implementation details, has leaked into
// our domain model But, I also don't love the idea of using generics across
// architectural boundaries and I _think_ that's what we'd want to do otherwise.
// That must not be true though, because this app would definitely be possible
// without generics.
export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;
