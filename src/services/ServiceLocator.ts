import AxiosHttpNotehubAccessor from "./notehub/AxiosHttpNotehubAccessor";
import AppService, { AppServiceInterface } from "./AppService";
import NotehubDataProvider from "./notehub/NotehubDataProvider";
import Config from "../../config";
import PrismaDatastoreEventHandler from "./prisma-datastore/PrismaDatastoreEventHandler";
import { PrismaClient } from "@prisma/client";
import { NoopSparrowEventHandler } from "./SparrowEvent";
import { PrismaDataProvider } from "./prisma-datastore/PrismaDataProvider";

// this class provides whatever service is needed to the React view component that needs it
class ServiceLocator {
  private appService: AppServiceInterface;

  constructor() {
    const notehubAccessor = new AxiosHttpNotehubAccessor(
      Config.hubBaseURL,
      Config.hubDeviceUID,
      Config.hubProjectUID,
      Config.hubAuthToken,
      Config.hubHistoricalDataStartDate
    );
    // todo factor this out so that we have clear separation of the notehub implementation from the datastore implementation
    const prisma = Config.databaseURL ? new PrismaClient({datasources: {db: { url: Config.databaseURL }}}) : null;
    const eventHandler = prisma ? new PrismaDatastoreEventHandler(prisma) : new NoopSparrowEventHandler();
    const dataProvider = prisma ? new PrismaDataProvider(prisma, Config.hubProjectUID) : new NotehubDataProvider(notehubAccessor);
    this.appService = new AppService(dataProvider, eventHandler);
  }

  getAppService(): AppServiceInterface {
    return this.appService;
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
