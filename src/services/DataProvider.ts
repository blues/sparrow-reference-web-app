import Gateway from "../components/models/Gateway";
import Node from "../components/models/Node";
import Reading from "../components/models/readings/Reading";

// this interface shows gateway or node data - nothing more, nothing less
interface DataProvider {
  getGateways: () => Promise<Gateway[]>;

  getGateway: (gatewayUID: string) => Promise<Gateway>;

  getNodes: (gatewayUIDs: string[]) => Promise<Node[]>;

  getNode: (gatewayUID: string, nodeId: string) => Promise<Node>;

  getNodeData: (
    gatewayUID: string,
    nodeId: string,
    startDate?: string
  ) => Promise<Reading<unknown>[]>;
}

// eslint-disable-next-line import/prefer-default-export
export type { DataProvider };
