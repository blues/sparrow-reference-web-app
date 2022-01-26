import axios from "axios";
import { NotehubAccessor } from "./NotehubAccessor";
import NotehubDevice from "./models/NotehubDevice";
import { HTTP_HEADER } from "../../constants/http";

// this class directly interacts with Notehub via HTTP calls
export default class AxiosHttpNotehubAccessor implements NotehubAccessor {
  baseURL: string;

  hubDeviceUID: string;

  commonHeaders;

  constructor(
    hubBaseURL: string,
    hubAppUID: string,
    hubDeviceUID: string,
    hubAuthToken: string
  ) {
    this.baseURL = `${hubBaseURL}/v1/projects/${hubAppUID}`;
    this.hubDeviceUID = hubDeviceUID;
    this.commonHeaders = {
      [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
      [HTTP_HEADER.SESSION_TOKEN]: hubAuthToken,
    };
  }

  async getGateway(hubDeviceUID: string) {
    const endpoint = `${this.baseURL}/devices/${hubDeviceUID}`;
    const resp = await axios.get(endpoint, { headers: this.commonHeaders });
    return resp.data as NotehubDevice;
  }
}
