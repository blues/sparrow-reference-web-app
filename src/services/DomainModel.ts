// Do not assume you can reach every node, sensor, or reading starting from a
// gateway you're looking at. Be mindful that a Query is probably in effect
// which has limited the extent to which we have populated all the objects into
// memory. For example, if you're working with recent data from the  'Black
// Pearl' node you might have info about the Gateway, but just the one
// node, and a few days of readings. You'll find `Unknown`s at the points in the
// tree that we don't care about in the context of an active Query.

export interface Unknown {
  // Unknown means you've reached an unexplored part of the tree, not a dead end.
  explored: false;
}

export interface Query {
  params: QueryParam[]; // TBD what a QueryParam is
  results: Gateway[] | Node[] | Sensor[] | Reading[];
}

export interface Gateway {
  gatewayID: string;
  nodes: Node[] | Unknown;
}

export interface Node {
  nodeID: string;
  gateway: Gateway | null | Unknown;
  sensors: Sensor[] | Unknown;
  name: string | Unknown;
  location: string | Unknown;
  description: string | Unknown;
}

export interface Sensor {
  node: Node;
  schema: ReadingSchema;
  readings: Reading[] | Unknown;
}

export interface ReadingSchema {
  unit: string; // e.g. Kelvin
  name: string; // e.g. Outdoor Temperature
  class: string; // e.g. Temperature.
}

export interface Reading {
  timestamp: Date;
  value: number | object;
}
