import Gateway from "../../components/models/Gateway";
import Sensor from "../../components/models/Sensor";
import NotehubDevice from "./models/NotehubDevice";
import { DataProvider } from "../DataProvider";
import { NotehubAccessor } from "./NotehubAccessor";

// this file connects to Notehub API endpoints to fetch data
export function notehubDeviceToSparrowGateway(device: NotehubDevice) {
  return {
    lastActivity: device.last_activity,
    ...((device?.triangulated_location || device?.tower_location) && {
      location: device?.triangulated_location?.name
        ? device.triangulated_location.name
        : device.tower_location?.name,
    }),
    serialNumber: device.serial_number,
    uid: device.uid,
    voltage: device.voltage,
  };
}

export default class NotehubDataProvider implements DataProvider {
  notehubAccessor: NotehubAccessor;

  constructor(notehubAccessor: NotehubAccessor) {
    this.notehubAccessor = notehubAccessor;
  }

  // eventually this projectUID will need to be passed in - just not yet
  async getGateways() {
    const gateways: Gateway[] = [];
    const rawGateways = await this.notehubAccessor.getGateways();
    rawGateways.forEach((gateway) => {
      gateways.push(notehubDeviceToSparrowGateway(gateway));
    });
    return gateways;
  }

  async getGateway(gatewayUID: string) {
    const singleGatewayJson = await this.notehubAccessor.getGateway(gatewayUID);

    const singleGateway = notehubDeviceToSparrowGateway(singleGatewayJson);

    return singleGateway;
  }

  // todo refactor in future story
  // stubbing this call to keep interface from yelling
  async getLatestSensorData(gatewaysList: Gateway[]) {
    const stubbedSensorData: Sensor = {
      gatewayUID: "1234",
      macAddress: "hello_world",
      humidity: 2,
      pressure: 100000,
      temperature: 26,
      voltage: 3.4,
      lastActivity: "2021-11-11T16:40:02Z",
    };

    // call notehubApiService endpoint
    await Promise.resolve();

    return [stubbedSensorData];
  }
}
