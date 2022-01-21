import axios from "axios";
import { NotehubAccessor } from "./NotehubAccessor";
import NotehubDevice from "./models/NotehubDevice";
import Config from "../../../config";
import { HTTP_HEADER } from "../../constants/http";
import { ERROR_MESSAGE } from "../../constants/ui";

const COMMON_HEADERS = {
  [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
  [HTTP_HEADER.SESSION_TOKEN]: Config.hubAuthToken,
};

// this class directly interacts with Notehub via HTTP calls
export default class AxiosHttpNotehubAccessor implements NotehubAccessor {
  baseURL: string;

  constructor() {
    this.baseURL = `${Config.hubBaseURL}/v1/projects/${Config.hubAppUID}`;
  }

  // Eventually we’ll want to find all valid gateways in a Notehub project.
  // For now, just take the hardcoded gateway UID from the starter’s
  // environment variables and use that.
  async getGateways() {
    const gateway = await this.getGateway(Config.hubDeviceUID);
    return [gateway];
  }

  async getGateway(gatewayUID: string) {
    const endpoint = `${this.baseURL}/devices/${gatewayUID}`;
    try {
      const resp = await axios.get(endpoint, { headers: COMMON_HEADERS });
      return resp.data as NotehubDevice;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 401) {
          throw new Error(ERROR_MESSAGE.UNAUTHORIZED);
        }
        if (e.response?.status === 403) {
          throw new Error(ERROR_MESSAGE.FORBIDDEN);
        }
        if (e.response?.status === 404) {
          throw new Error(ERROR_MESSAGE.GATEWAY_NOT_FOUND);
        }
      }
      throw new Error(ERROR_MESSAGE.INTERNAL_ERROR);
    }
  }
}
