import AxiosHttpNotehubAccessor, { Context } from "./notehub/AxiosHttpNotehubAccessor";
import AppService, { AppServiceInterface } from "./AppService";
import NotehubDataProvider from "./notehub/NotehubDataProvider";
import Config from "../../config";
import { CLSStore } from "./contextualize";

// this class provides whatever service is needed to the React view component that needs it
class ServiceLocator {
  appService: AppServiceInterface;
  notehubAccessor: AxiosHttpNotehubAccessor;

  constructor() {
    this.notehubAccessor = new AxiosHttpNotehubAccessor(
      Config.hubBaseURL,
      new CLSStore('AxiosHttpNotehubAccessor')
    );
    const notehubDataProvider = new NotehubDataProvider(this.notehubAccessor);
    this.appService = new AppService(notehubDataProvider);
  }

  getAppService(): AppServiceInterface {
    return this.appService;
  }

  async sessionContext(context: any) {
    // for now, we're just using the global config. But later we'll pull values from the session.
    await this.notehubAccessor.setContext(Config);
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
