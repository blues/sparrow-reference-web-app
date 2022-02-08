import Gateway from "../components/models/Gateway";
import Sensor from "../components/models/Sensor";
import SensorReading from "../components/models/readings/SensorReading";
import { DataProvider } from "./DataProvider";

// this class / interface combo passes data and functions to the service locator file
interface AppServiceInterface {
  getGateways: () => Promise<Gateway[]>;
  getGateway: (gatewayUID: string) => Promise<Gateway>;
  getSensors: (gatewayUIDs: string[]) => Promise<Sensor[]>;
  getSensor: (gatewayUID: string, sensorUID: string) => Promise<Sensor>;
  getSensorData: (
    gatewayUID: string,
    sensorUID: string
  ) => Promise<SensorReading<unknown>[]>;
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

  async getSensors(gatewayUIDs: string[]) {
    return this.dataProvider.getSensors(gatewayUIDs);
  }

  async getSensor(gatewayUID: string, sensorUID: string) {
    return this.dataProvider.getSensor(gatewayUID, sensorUID);
  }

  async getSensorData(gatewayUID: string, sensorUID: string) {
    return this.dataProvider.getSensorData(gatewayUID, sensorUID);
  }
}
