import Gateway from "../../models/Gateway";
import { GatewayDataService } from "../interfaces/GatewayDataService";
import { NotehubApiService } from "../interfaces/NotehubApiService";
import config from "../../../config";

export default class NotehubGatewayDataService implements GatewayDataService {
  notehubApiService: NotehubApiService;

  constructor(notehubApiService: NotehubApiService) {
    this.notehubApiService = notehubApiService;
  }

  // eventually this projectUID will need to be passed in - just not yet
  async getGateways(projectUID: string) {
    const gateways: Gateway[] = [];

    const gatewayInfo = await this.notehubApiService.getGateways(
      config.hubDeviceUID
    );

    const gateway = {
      lastActivity: gatewayInfo.last_activity,
      location: gatewayInfo.tower_location?.name,
      serialNumber: gatewayInfo.serial_number,
      uid: gatewayInfo.uid,
      voltage: gatewayInfo.voltage,
    };
    gateways.push(gateway);

    return gateways;
  }
}
