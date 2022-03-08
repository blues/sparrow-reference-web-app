import AxiosHttpNotehubAccessor from "./notehub/AxiosHttpNotehubAccessor";
import AppService, { AppServiceInterface } from "./AppService";
import NotehubDataProvider from "./notehub/NotehubDataProvider";
import Config from "../../config";
import { UrlManager } from "../components/presentation/UrlManager";
import { NextJsUrlManager } from "../adapters/nextjs-sparrow/NextJsUrlManager";
import { AttributeStore } from "./AttributeStore";
import { NotehubAccessor } from "./notehub/NotehubAccessor";
import { DataProvider } from "./DataProvider";
import { NotehubAttributeStore } from "./notehub/NotehubAttributeStore";
import PrismaDatastoreEventHandler from "./prisma-datastore/PrismaDatastoreEventHandler";
import { PrismaClient } from "@prisma/client";
import { NoopSparrowEventHandler, SparrowEventHandler } from "./SparrowEvent";
import { PrismaDataProvider } from "./prisma-datastore/PrismaDataProvider";

// this class provides whatever service is needed to the React view component that needs it
class ServiceLocator {
  private appService?: AppServiceInterface;

  private urlManager?: UrlManager;

  private dataProvider?: DataProvider;

  private notehubAccessor?: NotehubAccessor;

  private attributeStore?: AttributeStore;

  private prisma?: PrismaClient;

  private eventHandler?: SparrowEventHandler

  constructor() {
    this.prisma = Config.databaseURL ? new PrismaClient({datasources: {db: { url: Config.databaseURL }}}) : undefined;
  }

  getAppService(): AppServiceInterface {
    if (!this.appService) {
      this.appService = new AppService(
        this.getDataProvider(),
        this.getAttributeStore(),
        this.getEventHandler()
      );
    }
    return this.appService;
  }

  private getDataProvider(): DataProvider {
    if (!this.dataProvider) {
      // todo factor this out so that we have clear separation of the notehub implementation from the datastore implementation
      // lazy instantiation makes this harder - not sure why we have this since it's easier to just construct everything in a single method
      // based on the configuration
      this.dataProvider = this.prisma ? new PrismaDataProvider(this.prisma, Config.hubProjectUID) : new NotehubDataProvider(this.getNotehubAccessor());
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
        Config.hubHistoricalDataStartDate
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
