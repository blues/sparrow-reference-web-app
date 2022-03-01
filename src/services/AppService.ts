import { ErrorWithCause } from "pony-cause";
import Gateway from "../components/models/Gateway";
import Sensor from "../components/models/Sensor";
import SensorReading from "../components/models/readings/SensorReading";
import { DataProvider } from "./DataProvider";
import { AttributeStore } from "./AttributeStore";

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
  setSensorName: (
    gatewayUID: string,
    macAddress: string,
    name: string
  ) => Promise<void>;
  setSensorLocation: (
    gatewayUID: string,
    macAddress: string,
    loc: string
  ) => Promise<void>;
}

export type { AppServiceInterface };

export default class AppService implements AppServiceInterface {
  constructor(
    private dataProvider: DataProvider,
    private attributeStore: AttributeStore
  ) {}

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

  async setSensorName(gatewayUID: string, macAddress: string, name: string) {
    const store = this.attributeStore;
    try {
      await store.updateSensorName(gatewayUID, macAddress, name);
    } catch (e) {
      const e2 = new ErrorWithCause(`could not setSensorName`, { cause: e });
      throw e2;
    }
  }

  async setSensorLocation(gatewayUID: string, macAddress: string, loc: string) {
    const store = this.attributeStore;
    try {
      await store.updateSensorLocation(gatewayUID, macAddress, loc);
    } catch (e) {
      throw new ErrorWithCause(`could not setSensorLocation`, { cause: e });
    }
  }
}
