import { ErrorWithCause } from "pony-cause";
import Gateway from "../components/models/Gateway";
import Node from "../components/models/Node";
import SensorReading from "../components/models/readings/SensorReading";
import { DataProvider } from "./DataProvider";
import { AttributeStore } from "./AttributeStore";

// this class / interface combo passes data and functions to the service locator file
interface AppServiceInterface {
  getGateways: () => Promise<Gateway[]>;
  getGateway: (gatewayUID: string) => Promise<Gateway>;
  getNodes: (gatewayUIDs: string[]) => Promise<Node[]>;
  getNode: (gatewayUID: string, nodeId: string) => Promise<Node>;
  getNodeData: (
    gatewayUID: string,
    nodeId: string
  ) => Promise<SensorReading<unknown>[]>;
  setNodeName: (
    gatewayUID: string,
    nodeId: string,
    name: string
  ) => Promise<void>;
  setNodeLocation: (
    gatewayUID: string,
    nodeId: string,
    loc: string
  ) => Promise<void>;
}

export type { AppServiceInterface };

export default class AppService implements AppServiceInterface {
  constructor(
    private dataProvider: DataProvider,
    private attributeStore: AttributeStore
  ) {}

  async getGateways() {
    return this.dataProvider.getGateways();
  }

  async getGateway(gatewayUID: string) {
    return this.dataProvider.getGateway(gatewayUID);
  }

  async getNodes(gatewayUIDs: string[]) {
    return this.dataProvider.getNodes(gatewayUIDs);
  }

  async getNode(gatewayUID: string, nodeId: string) {
    return this.dataProvider.getNode(gatewayUID, nodeId);
  }

  async getNodeData(gatewayUID: string, nodeId: string) {
    return this.dataProvider.getNodeData(gatewayUID, nodeId);
  }

  async setNodeName(gatewayUID: string, nodeId: string, name: string) {
    const store = this.attributeStore;
    try {
      await store.updateNodeName(gatewayUID, nodeId, name);
    } catch (e) {
      const e2 = new ErrorWithCause(`could not setNodeName`, { cause: e });
      throw e2;
    }
  }

  async setNodeLocation(gatewayUID: string, nodeId: string, loc: string) {
    const store = this.attributeStore;
    try {
      await store.updateNodeLocation(gatewayUID, nodeId, loc);
    } catch (e) {
      throw new ErrorWithCause(`could not setNodeLocation`, { cause: e });
    }
  }
}
