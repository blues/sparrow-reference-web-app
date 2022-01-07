import { GatewayDataService } from "./interfaces/GatewayDataService";
import NotehubGatewayDataService from "./notehub/NotehubGatewayDataService";

class ServiceLocator {
  gatewayDataService: GatewayDataService;

  constructor() {
    this.gatewayDataService = new NotehubGatewayDataService();
  }

  getGatewayService(): GatewayDataService {
    return this.gatewayDataService;
  }
}

const Services = new ServiceLocator();

function services() {
  return Services;
}

export { services };
