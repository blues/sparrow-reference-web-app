import axios from "axios";
import { NotehubAccessor } from "./NotehubAccessor";
import NotehubDevice from "./models/NotehubDevice";

// this class directly interacts with Notehub via HTTP calls
export default class AxiosHttpNotehubAccessor implements NotehubAccessor {
  // todo eventually our config will be supplied from one source of truth in the app
  appBaseUrl: string;

  constructor() {
    this.appBaseUrl = "http://localhost:4000";
  }

  async getGateway(hubDeviceUID: string) {
    const resp = await axios.get(
      `${this.appBaseUrl}/api/gateways/${hubDeviceUID}`
    );
    return resp.data as NotehubDevice;
  }
}
