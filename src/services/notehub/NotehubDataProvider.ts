import Gateway from "../../components/models/Gateway";
import NotehubDevice from "./models/NotehubDevice";
import { DataProvider } from "../interfaces/DataProvider";
import { NotehubApiService } from "../interfaces/NotehubApiService";
import config from "../../../config";

function notehubDeviceToSparrowGateway(device: NotehubDevice) {
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
  notehubApiService: NotehubApiService;

  constructor(notehubApiService: NotehubApiService) {
    this.notehubApiService = notehubApiService;
  }

  // eventually this projectUID will need to be passed in - just not yet
  async getGateways() {
    const gateways: Gateway[] = [];

    const gatewayJson = await this.notehubApiService.getGateways(
      config.hubDeviceUID
    );

    const gateway = notehubDeviceToSparrowGateway(gatewayJson);
    gateways.push(gateway);

    return gateways;
  }
}
