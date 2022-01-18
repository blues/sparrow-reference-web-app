import Gateway from "../../components/models/Gateway";
import NotehubDevice from "./models/NotehubDevice";
import { GatewayDataService } from "../interfaces/GatewayDataService";
import { NotehubApiService } from "../interfaces/NotehubApiService";
import config from "../../../config";

export default class NotehubGatewayDataService implements GatewayDataService {
  notehubApiService: NotehubApiService;

  constructor(notehubApiService: NotehubApiService) {
    this.notehubApiService = notehubApiService;
  }

  // todo move this function somewhere else - here for now to resolve merging with main
  notehubToSparrow(device: NotehubDevice) {
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

  // eventually this projectUID will need to be passed in - just not yet
  async getGateways(projectUID: string) {
    const gateways: Gateway[] = [];

    const gatewayJson = await this.notehubApiService.getGateways(
      config.hubDeviceUID
    );

    const gateway = this.notehubToSparrow(gatewayJson);
    gateways.push(gateway);

    return gateways;
  }
}
