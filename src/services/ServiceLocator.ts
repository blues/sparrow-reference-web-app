import AxiosHttpNotehubAccessor from "./notehub/AxiosHttpNotehubAccessor";
import AppService, { AppServiceInterface } from "./AppService";
import NotehubDataProvider from "./notehub/NotehubDataProvider";
import Config from "../../config";

// this class provides whatever service is needed to the React view component that needs it
class ServiceLocator {
  appService: AppServiceInterface;

  constructor() {
    const notehubAccessor = new AxiosHttpNotehubAccessor(
      Config.hubBaseURL,
      Config.hubAppUID,
      Config.hubDeviceUID,
      Config.hubAuthToken
    );
    const notehubDataProvider = new NotehubDataProvider(notehubAccessor);
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
