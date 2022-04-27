import { ErrorWithCause } from "pony-cause";
import Gateway from "../components/models/Gateway";
import Node from "../components/models/Node";
import Reading from "../components/models/readings/Reading";
import { DataProvider } from "./DataProvider";
import { AttributeStore } from "./AttributeStore";
import { SparrowEventHandler } from "./SparrowEvent";
import { SparrowEvent } from "./notehub/SparrowEvents";
import { ProjectID } from "./DomainModel";
import { IDBuilder } from "./IDBuilder";
// eslint-disable-next-line import/no-named-as-default
import AppModelBuilder from "./AppModelBuilder";
import * as AppModel from "./AppModel";

// this class / interface combo passes data and functions to the service locator file
interface AppServiceInterface {
  getGateways: () => Promise<Gateway[]>;
  getGateway: (gatewayUID: string) => Promise<Gateway>;
  setGatewayName: (gatewayUID: string, name: string) => Promise<void>;
  getNodes: (gatewayUIDs: string[]) => Promise<Node[]>;
  getNode: (gatewayUID: string, nodeId: string) => Promise<Node>;
  getNodeData: (
    gatewayUID: string,
    nodeId: string,
    minutesBeforeNow?: string
  ) => Promise<Reading<unknown>[]>;
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

  getLatestProjectReadings(): Promise<AppModel.Project>;
  getReadingCount(): Promise<number>;

  handleEvent(event: SparrowEvent): Promise<void>;

  performBulkDataImport(): Promise<AppModel.BulkDataImportStatus>;
}

export type { AppServiceInterface };

export default class AppService implements AppServiceInterface {
  private projectID: ProjectID;

  constructor(
    projectUID: string,
    private readonly idBuilder: IDBuilder,
    private dataProvider: DataProvider,
    private attributeStore: AttributeStore,
    private sparrowEventHandler: SparrowEventHandler
  ) {
    this.projectID = this.idBuilder.buildProjectID(projectUID);
  }

  async getGateways() {
    return this.dataProvider.getGateways();
  }

  async getGateway(gatewayUID: string) {
    return this.dataProvider.getGateway(gatewayUID);
  }

  async setGatewayName(gatewayUID: string, name: string) {
    const store = this.attributeStore;
    try {
      await store.updateGatewayName(gatewayUID, name);
    } catch (e) {
      const e2 = new ErrorWithCause(`could not setGatewayName`, { cause: e });
      throw e2;
    }
  }

  async getNodes(gatewayUIDs: string[]) {
    return this.dataProvider.getNodes(gatewayUIDs);
  }

  async getNode(gatewayUID: string, nodeId: string) {
    return this.dataProvider.getNode(gatewayUID, nodeId);
  }

  async getNodeData(
    gatewayUID: string,
    nodeId: string,
    minutesBeforeNow?: string
  ) {
    return this.dataProvider.getNodeData(gatewayUID, nodeId, minutesBeforeNow);
  }

  async handleEvent(event: SparrowEvent) {
    return this.sparrowEventHandler.handleEvent(event);
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

  async getLatestProjectReadings(): Promise<AppModel.Project> {
    const projectID = this.currentProjectID();
    const latest = await this.dataProvider.queryProjectLatestValues(projectID);
    return AppModelBuilder.buildProjectReadingsSnapshot(latest.results);
  }

  async getReadingCount(): Promise<number> {
    const projectID = this.currentProjectID();
    const count = await this.dataProvider.queryProjectReadingCount(projectID);
    return count.results;
  }

  private currentProjectID() {
    return this.projectID;
  }

  async performBulkDataImport(): Promise<AppModel.BulkDataImportStatus> {
    const startTime = performance.now();
    try {
      const b = await this.dataProvider.doBulkImport();
      const finishTime = performance.now();
      return {
        elapsedTimeMs: finishTime - startTime,
        erroredItemCount: b.errorCount,
        importedItemCount: b.itemCount,
        state: "done",
      };
    } catch (cause) {
      const finishTime = performance.now();
      return {
        elapsedTimeMs: finishTime - startTime,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        err: `Please Try Again. Cause: ${cause}`,
        erroredItemCount: 0,
        importedItemCount: 0,
        state: "failed",
      };
    }
  }
}
