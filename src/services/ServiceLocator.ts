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

// this class provides whatever service is needed to the React view component that needs it
class ServiceLocator {
  private appService?: AppServiceInterface;

  private urlManager?: UrlManager;

  private dataProvider?: DataProvider;

  private notehubAccessor?: NotehubAccessor;

  private attributeStore?: AttributeStore;

  getAppService(): AppServiceInterface {
    if (!this.appService) {
      this.appService = new AppService(
        this.getDataProvider(),
        this.getAttributeStore()
      );
    }
    return this.appService;
  }

  private getDataProvider(): DataProvider {
    if (!this.dataProvider) {
      this.dataProvider = new NotehubDataProvider(this.getNotehubAccessor());
    }
    return this.dataProvider;
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
