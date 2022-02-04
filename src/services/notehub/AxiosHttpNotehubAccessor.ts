import axios from "axios";
import { NotehubAccessor } from "./NotehubAccessor";
import NotehubDevice from "./models/NotehubDevice";
import { HTTP_HEADER } from "../../constants/http";
import { getError, ERROR_CODES } from "../Errors";
import NotehubLatestEvents from "./models/NotehubLatestEvents";
import NotehubSensorConfig from "./models/NotehubSensorConfig";
import NotehubErr from "./models/NotehubErr";
import { Store } from "../contextualize";


export interface Context {
  hubAppUID: string;
  hubDeviceUID: string;
  hubProductUID: string;
  hubAuthToken: string;
}


// this class directly interacts with Notehub via HTTP calls
export default class AxiosHttpNotehubAccessor implements NotehubAccessor {

  store: Store<Context>;
  hubBaseURL: string;

  commonHeaders;

  constructor(hubBaseURL: string, store:Store<Context>) {
    this.hubBaseURL = hubBaseURL;
    this.commonHeaders = {
      [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON
    };
    this.store = store;
  }

  /**
   * Set parameters from the origin request that provide authentication and other details needed to access notehub.
   * @param context The context for the calling
   */
  async setContext(context: Context) {
    this.store.set(context);
  }

  context() : Context {
    return this.store.get();
  }

  // Eventually we’ll want to find all valid gateways in a Notehub project.
  // For now, just take the hardcoded gateway UID from the starter’s
  // environment variables and use that.
  async getDevices() {
    const device = await this.getDevice(this.context().hubDeviceUID);
    return [device];
  }

  async getDevice(hubDeviceUID: string) {
    const context: Context = this.context();

    const endpoint = `${this.hubBaseURL}/v1/projects/${context.hubAppUID}/devices/${context.hubDeviceUID}`;
    const headers = Object.assign({[HTTP_HEADER.SESSION_TOKEN]: context.hubAuthToken}, this.commonHeaders);
    
    try {
      const resp = await axios.get(endpoint, { headers });
      return resp.data as NotehubDevice;
    } catch (e) {
      throw this.errorWithCode(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  httpErrorToErrorCode(e: unknown): ERROR_CODES {
    let errorCode = ERROR_CODES.INTERNAL_ERROR;
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 401) {
        errorCode = ERROR_CODES.UNAUTHORIZED;
      }
      if (e.response?.status === 403) {
        errorCode = ERROR_CODES.FORBIDDEN;
      }
      if (e.response?.status === 404) {
        errorCode = ERROR_CODES.DEVICE_NOT_FOUND;
      }
    }
    return errorCode;
  }

  errorWithCode(e: unknown): Error {
    const errorCode = this.httpErrorToErrorCode(e);
    return getError(errorCode, { cause: e as Error });
  }

  async getLatestEvents(hubDeviceUID: string) {
    const context = this.context();
    const endpoint = `${this.hubBaseURL}/v1/projects/${context.hubAppUID}/devices/${hubDeviceUID}/latest`;
    const headers = Object.assign({[HTTP_HEADER.SESSION_TOKEN]: context.hubAuthToken}, this.commonHeaders);
    try {
      const resp = await axios.get(endpoint, { headers });
      return resp.data as NotehubLatestEvents;
    } catch (e) {
      throw this.errorWithCode(e);
    }
  }

  async getConfig(hubDeviceUID: string, macAddress: string) {
    const context = this.context();
    const endpoint = `${this.hubBaseURL}/req?product=${context.hubProductUID}&device=${hubDeviceUID}`;
    const body = {
      req: "note.get",
      file: "config.db",
      note: macAddress,
    };
    let resp;
    const headers = Object.assign({[HTTP_HEADER.SESSION_TOKEN]: context.hubAuthToken}, this.commonHeaders);
    try {
      resp = await axios.post(endpoint, body, { headers });
    } catch (e) {
      throw getError(ERROR_CODES.INTERNAL_ERROR, { cause: e as Error });
    }
    if ("err" in resp.data) {
      const { err } = resp.data as NotehubErr;

      // If the mac address cannot be found the API will return a
      // “note-noexist” error, which we ignore because that just means
      // the sensor does not have a name / location yet.
      if (err.includes("device-noexist")) {
        throw getError(ERROR_CODES.DEVICE_NOT_FOUND);
      }
      if (err.includes("insufficient permissions")) {
        throw getError(ERROR_CODES.FORBIDDEN);
      }
    }
    return resp.data as NotehubSensorConfig;
  }
}
