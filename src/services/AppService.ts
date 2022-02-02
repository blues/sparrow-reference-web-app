import Gateway from "../components/models/Gateway";
import Sensor from "../components/models/Sensor";
import { DataProvider } from "./DataProvider";

// this class / interface combo passes data and functions to the service locator file
interface AppServiceInterface {
  getGateways: () => Promise<Gateway[]>;
  getGateway: (gatewayUID: string) => Promise<Gateway>;
  getLatestSensorData: (gateways: Gateway[]) => Promise<Sensor[]>;
}

export type { AppServiceInterface };

export default class AppService implements AppServiceInterface {
  dataProvider: DataProvider;

  constructor(dataProvider: DataProvider) {
    this.dataProvider = dataProvider;
  }

  async getGateways() {
    return this.dataProvider.getGateways();
  }

  async getGateway(gatewayUID: string) {
    return this.dataProvider.getGateway(gatewayUID);
  }

  async getLatestSensorData(gateways: Gateway[]) {
    return this.dataProvider.getLatestSensorData(gateways);
  }
}
