import { ParsedUrlQuery } from "querystring";

export default interface SparrowQueryInterface extends ParsedUrlQuery {
  gatewayUID: string;
  sensorUID: string;
}
