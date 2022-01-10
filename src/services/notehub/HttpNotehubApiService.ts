import axios from "axios";
import { NotehubApiService } from "../interfaces/NotehubApiService";
import NotehubDevice from "./models/NotehubDevice";

export default class HttpNotehubApiService implements NotehubApiService {
  // todo eventually our config will be supplied from one source of truth in the app
  appBaseUrl: string;

  constructor() {
    this.appBaseUrl = "http://localhost:4000";
  }

  async getGateways(hubDeviceUID: string) {
    const resp = await axios.get(
      `${this.appBaseUrl}/api/gateways/${hubDeviceUID}`
    );
    return resp.data as NotehubDevice;
  }
}
