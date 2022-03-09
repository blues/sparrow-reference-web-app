import GatewayDEPRECATED from "../components/models/Gateway";
import NodeDEPRECATED from "../components/models/Node";
import SensorReadingDEPRECATED from "../components/models/readings/SensorReading";
import { GatewayID, NodeID, Project, SensorTypeID } from "./DomainModel";

// this interface shows gateway or node data - nothing more, nothing less
interface DataProvider {
  getGateways: () => Promise<GatewayDEPRECATED[]>;

  getGateway: (gatewayUID: string) => Promise<GatewayDEPRECATED>;

  getNodes: (gatewayUIDs: string[]) => Promise<NodeDEPRECATED[]>;

  getNode: (gatewayUID: string, nodeId: string) => Promise<NodeDEPRECATED>;

  getNodeData: (
    gatewayUID: string,
    nodeId: string,
    options?: {
      startDate?: Date;
    }
  ) => Promise<SensorReadingDEPRECATED<unknown>[]>;

  queryProject(f: SimpleFilter): Query<SimpleFilter, Project>;
  queryLatestValues(): Query<SimpleFilter, Project>;
}

// eslint-disable-next-line import/prefer-default-export
export type { DataProvider };

////////////////////////////////////////////////////////////////////////////////
// Query
//
// A user of the website might not 'think' about the following things unless
// they had a way to save favorite queries as first class citizens of the app.
//

export type DateRange = { from: Date; to: Date };

export const all = Symbol("All");
export type All = typeof all;

export const latest = Symbol("Latest");
export type Latest = typeof latest;

export type Nothing = undefined;

export type SimpleFilter = {
  gateways?: GatewayID | All | Nothing;
  nodes?: NodeID | All | Nothing;
  SensorTypes?: SensorTypeID | All | Nothing;
  readingTimeframe?: DateRange | All | Nothing | Latest;
};

export interface Query<R, P> {
  request: R;
  results: P;
}
