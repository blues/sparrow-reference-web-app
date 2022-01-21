import axios from "axios";
import { NotehubAccessor } from "./NotehubAccessor";
import NotehubDevice from "./models/NotehubDevice";
import { HTTP_HEADER } from "../../constants/http";
import { ERROR_MESSAGE } from "../../constants/ui";

// this class directly interacts with Notehub via HTTP calls
export default class AxiosHttpNotehubAccessor implements NotehubAccessor {
  baseURL: string;

  hubAppUID: string;

  hubDeviceUID: string;

  commonHeaders;

  constructor(
    hubBaseURL: string,
    hubAppUID: string,
    hubDeviceUID: string,
    hubAuthToken: string
  ) {
    this.baseURL = `${hubBaseURL}/v1/projects/${hubAppUID}`;
    this.hubAppUID = hubAppUID;
    this.hubDeviceUID = hubDeviceUID;
    this.commonHeaders = {
      [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
      [HTTP_HEADER.SESSION_TOKEN]: hubAuthToken,
    };
  }

  // Eventually we’ll want to find all valid gateways in a Notehub project.
  // For now, just take the hardcoded gateway UID from the starter’s
  // environment variables and use that.
  async getGateways() {
    const gateway = await this.getGateway(this.hubDeviceUID);
    return [gateway];
  }

  async getGateway(gatewayUID: string) {
    const endpoint = `${this.baseURL}/devices/${gatewayUID}`;
    try {
      const resp = await axios.get(endpoint, { headers: this.commonHeaders });
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
