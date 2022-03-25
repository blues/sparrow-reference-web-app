import AxiosHttpNotehubAccessor from "./notehub/AxiosHttpNotehubAccessor";
import AppService, { AppServiceInterface } from "./AppService";
import NotehubDataProvider from "./notehub/NotehubDataProvider";
import Config from "../../config";
import { UrlManager } from "../components/presentation/UrlManager";
import { NextJsUrlManager } from "../adapters/nextjs-sparrow/NextJsUrlManager";
import { AttributeStore } from "./AttributeStore";
import { NotehubAccessor } from "./notehub/NotehubAccessor";
import { DataProvider, QueryHistoricalReadings, QueryResult } from "./DataProvider";
import { NotehubAttributeStore } from "./notehub/NotehubAttributeStore";
import PrismaDatastoreEventHandler from "./prisma-datastore/PrismaDatastoreEventHandler";
import { PrismaClient } from "@prisma/client";
import { NoopSparrowEventHandler, SparrowEventHandler } from "./SparrowEvent";
import { PrismaDataProvider } from "./prisma-datastore/PrismaDataProvider";
import IDBuilder, { SimpleIDBuilder } from "./IDBuilder";
import Gateway from "../components/models/Gateway";
import Node from "../components/models/Node";
import ReadingDEPRECATED from "../components/models/readings/Reading";
import { ProjectHistoricalData, ProjectID, ProjectReadingsSnapshot } from "./DomainModel";

// todo(must) - temporary. remove when notehub and datastore implementations are working
class CompositeDataProvider implements DataProvider {
  constructor(private notehubProvider: NotehubDataProvider, private prismaDataProvider: PrismaDataProvider) {}
  
  getGateways(): Promise<Gateway[]> {
    return this.notehubProvider.getGateways();
  }
  getGateway(gatewayUID: string): Promise<Gateway> {
    return this.notehubProvider.getGateway(gatewayUID);
  }

  getNodes(gatewayUIDs: string[]): Promise<Node[]> {
    return this.notehubProvider.getNodes(gatewayUIDs);
  }
  getNode(gatewayUID: string, nodeId: string): Promise<Node> {
    return this.notehubProvider.getNode(gatewayUID, nodeId);
  }
  getNodeData(gatewayUID: string, nodeId: string, minutesBeforeNow?: string | undefined): Promise<ReadingDEPRECATED<unknown>[]> {
    return this.notehubProvider.getNodeData(gatewayUID, nodeId, minutesBeforeNow);
  }

  queryProjectLatestValues(projectID: ProjectID): Promise<QueryResult<ProjectID, ProjectReadingsSnapshot>> {
    return this.prismaDataProvider.queryProjectLatestValues(projectID);
  }
  queryProjectReadingSeries(query: QueryHistoricalReadings): Promise<QueryResult<QueryHistoricalReadings, ProjectHistoricalData>> {
    throw new Error("Method not implemented.");
  }
}

// this class provides whatever service is needed to the React view component that needs it
class ServiceLocator {
  private appService?: AppServiceInterface;

  private urlManager?: UrlManager;

  private dataProvider?: DataProvider;

  private notehubAccessor?: NotehubAccessor;

  private attributeStore?: AttributeStore;

  private prisma?: PrismaClient;

  private eventHandler?: SparrowEventHandler;

  constructor() {
    this.prisma = Config.databaseURL ? new PrismaClient({datasources: {db: { url: Config.databaseURL }}}) : undefined;
  }

  getAppService(): AppServiceInterface {
    if (!this.appService) {
      this.appService = new AppService(
        Config.hubProjectUID,
        new SimpleIDBuilder(),
        this.getDataProvider(),
        this.getAttributeStore(),
        this.getEventHandler()
      );
    }
    return this.appService;
  }

  private getDataProvider(): DataProvider {
    if (!this.dataProvider) {
      const projectID = IDBuilder.buildProjectID(Config.hubProjectUID);
      const notehubProvider = new NotehubDataProvider(this.getNotehubAccessor(), projectID);
      if (this.prisma) {
        const dataStoreProvider = new PrismaDataProvider(this.prisma, projectID);
        const combinedProvider = new CompositeDataProvider(notehubProvider, dataStoreProvider);
        this.dataProvider = combinedProvider;
      }
      else {
        this.dataProvider = notehubProvider;
      }
      // todo factor this out so that we have clear separation of the notehub implementation from the datastore implementation
      // lazy instantiation makes this harder - not sure why we have this since it's easier to just construct everything in a single method
      // based on the configuration
    }
    return this.dataProvider;
  }

  private getEventHandler(): SparrowEventHandler {
    if (!this.eventHandler) {      
      this.eventHandler = this.prisma ? new PrismaDatastoreEventHandler(this.prisma) : new NoopSparrowEventHandler();
    }
    return this.eventHandler;
  }

  private getNotehubAccessor(): NotehubAccessor {
    if (!this.notehubAccessor) {
      this.notehubAccessor = new AxiosHttpNotehubAccessor(
        Config.hubBaseURL,
        Config.hubDeviceUID,
        Config.hubProjectUID,
        Config.hubAuthToken,
        Config.hubHistoricalDataRecentMinutes
      );
    }
    return this.notehubAccessor;
  }

  getAttributeStore(): AttributeStore {
    if (!this.attributeStore) {
      this.attributeStore = new NotehubAttributeStore(
        this.getNotehubAccessor()
      );
    }
    return this.attributeStore;
  }

  getUrlManager(): UrlManager {
    if (!this.urlManager) {
      this.urlManager = NextJsUrlManager;
    }
    return this.urlManager;
  }  
}

let Services: ServiceLocator | null = null;

function services() {
  // Don’t create a ServiceLocator until it’s needed. This prevents all service
  // initialization steps from happening as soon as you import this module.
  if (!Services) {
    Services = new ServiceLocator();
  }
  return Services;
}

// eslint-disable-next-line import/prefer-default-export
export { services };
