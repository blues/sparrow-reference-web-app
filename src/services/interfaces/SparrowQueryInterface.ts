import { ParsedUrlQuery } from "querystring";

// custom interface to avoid UI believing query params can be undefined when they can't be
export default interface SparrowQueryInterface extends ParsedUrlQuery {
  gatewayUID: string;
  sensorUID: string;
}
