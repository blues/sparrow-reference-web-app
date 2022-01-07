import axios from "axios";
import Gateway from "../../models/Gateway";
import { GatewayDataService } from "../interfaces/GatewayDataService";
import config from "../../../config";
import NotehubDevice from "./NotehubDevice";

export default class NotehubGatewayDataService implements GatewayDataService {
  // eventually this projectUID will need to be passed in - just not yet
  async getGateways(projectUID: string) {
    const gateways: Gateway[] = [];

    // todo move this API call to a separate service of just APIs
    const resp = await axios.get(
      `${config.appBaseUrl}/api/gateways/${config.hubDeviceUID}`
    );
    const json = resp.data as NotehubDevice;

    const gateway = {
      lastActivity: json.last_activity,
      location: json.tower_location?.name,
      serialNumber: json.serial_number,
      uid: json.uid,
      voltage: json.voltage,
    };
    gateways.push(gateway);

    return gateways;
  }
}
