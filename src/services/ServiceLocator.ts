import HttpNotehubApiService from "./notehub/HttpNotehubApiService";
import AppService, { AppServiceInterface } from "./AppService";
import NotehubDataProvider from "./notehub/NotehubDataProvider";

class ServiceLocator {
  appService: AppServiceInterface;

  constructor() {
    const notehubApiService = new HttpNotehubApiService();
    const notehubDataProvider = new NotehubDataProvider(notehubApiService);
    this.appService = new AppService(notehubDataProvider);
  }

  getAppService(): AppServiceInterface {
    return this.appService;
  }
}

const Services = new ServiceLocator();

function services() {
  return Services;
}

// eslint-disable-next-line import/prefer-default-export
export { services };
