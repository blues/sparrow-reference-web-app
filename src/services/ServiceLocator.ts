import { GatewayDataService } from "./interfaces/GatewayDataService";
import NotehubGatewayDataService from "./notehub/NotehubGatewayDataService";
import HttpNotehubApiService from "./notehub/HttpNotehubApiService";
// import { DataProvider } from "./interfaces/DataProvider";
// import NotehubProvider from "./notehub/NotehubProvider";

class ServiceLocator {
  gatewayDataService: GatewayDataService;

  constructor() {
    const notehubApiService = new HttpNotehubApiService();
    // todo decide if we need this level of abstraction
    // const dataProvider = new NotehubProvider();
    this.gatewayDataService = new NotehubGatewayDataService(notehubApiService);
  }

  getGatewayService(): GatewayDataService {
    return this.gatewayDataService;
  }
}

const Services = new ServiceLocator();

function services() {
  return Services;
}

// eslint-disable-next-line import/prefer-default-export
export { services };
