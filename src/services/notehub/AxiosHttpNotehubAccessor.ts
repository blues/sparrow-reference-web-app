import axios from "axios";
import { NotehubAccessor } from "./NotehubAccessor";
import NotehubDevice from "./models/NotehubDevice";
import { HTTP_HEADER } from "../../constants/http";
import { getError, ERROR_CODES } from "../Errors";
import NotehubLatestEvents from "./models/NotehubLatestEvents";
import NotehubSensorConfig from "./models/NotehubSensorConfig";

// this class directly interacts with Notehub via HTTP calls
export default class AxiosHttpNotehubAccessor implements NotehubAccessor {
  hubBaseURL: string;

  hubAppUID: string;

  hubDeviceUID: string;

  hubProductUID: string;

  commonHeaders;

  constructor(
    hubBaseURL: string,
    hubAppUID: string,
    hubDeviceUID: string,
    hubAuthToken: string,
    hubProductUID: string
  ) {
    this.hubBaseURL = hubBaseURL;
    this.hubAppUID = hubAppUID;
    this.hubDeviceUID = hubDeviceUID;
    this.hubProductUID = hubProductUID;
    this.commonHeaders = {
      [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
      [HTTP_HEADER.SESSION_TOKEN]: hubAuthToken,
    };
  }

  // Eventually we’ll want to find all valid gateways in a Notehub project.
  // For now, just take the hardcoded gateway UID from the starter’s
  // environment variables and use that.
  async getDevices() {
    const device = await this.getDevice(this.hubDeviceUID);
    return [device];
  }

  async getDevice(hubDeviceUID: string) {
    const endpoint = `${this.hubBaseURL}/v1/projects/${this.hubAppUID}/devices/${hubDeviceUID}`;
    try {
      const resp = await axios.get(endpoint, { headers: this.commonHeaders });
      return resp.data as NotehubDevice;
    } catch (e) {
      let errorCode = ERROR_CODES.INTERNAL_ERROR;
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 401) {
          errorCode = ERROR_CODES.UNAUTHORIZED;
        }
        if (e.response?.status === 403) {
          errorCode = ERROR_CODES.FORBIDDEN;
        }
        if (e.response?.status === 404) {
          errorCode = ERROR_CODES.GATEWAY_NOT_FOUND;
        }
      }
      throw getError(errorCode, { cause: e as Error });
    }
  }

  async getLatestEvents(hubDeviceUID: string) {
    const endpoint = `${this.hubBaseURL}/v1/projects/${this.hubAppUID}/devices/${hubDeviceUID}/latest`;
    try {
      const resp = await axios.get(endpoint, { headers: this.commonHeaders });
      return resp.data as NotehubLatestEvents;
    } catch (e) {
      let errorCode = ERROR_CODES.INTERNAL_ERROR;
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 401) {
          errorCode = ERROR_CODES.UNAUTHORIZED;
        }
        if (e.response?.status === 403) {
          errorCode = ERROR_CODES.FORBIDDEN;
        }
        if (e.response?.status === 404) {
          // TODO: This needs to be something about events or sensors.
          errorCode = ERROR_CODES.GATEWAY_NOT_FOUND;
        }
      }
      throw getError(errorCode, { cause: e as Error });
    }
  }

  async getConfig(hubDeviceUID: string, macAddress: string) {
    const endpoint = `${this.hubBaseURL}/req?product=${this.hubProductUID}&device=${hubDeviceUID}`;
    const body = {
      req: "note.get",
      file: "config.db",
      note: macAddress,
    };
    try {
      const resp = await axios.post(endpoint, body, {
        headers: this.commonHeaders,
      });
      return resp.data as NotehubSensorConfig;
    } catch (e) {
      let errorCode = ERROR_CODES.INTERNAL_ERROR;
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 401) {
          errorCode = ERROR_CODES.UNAUTHORIZED;
        }
        if (e.response?.status === 403) {
          errorCode = ERROR_CODES.FORBIDDEN;
        }
        if (e.response?.status === 404) {
          // TODO: This needs to be something about sensors.
          errorCode = ERROR_CODES.GATEWAY_NOT_FOUND;
        }
      }
      throw getError(errorCode, { cause: e as Error });
    }
  }
}
