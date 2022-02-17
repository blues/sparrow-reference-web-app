import axios, { AxiosResponse } from "axios";
import { NotehubAccessor } from "./NotehubAccessor";
import NotehubDevice from "./models/NotehubDevice";
import { HTTP_HEADER } from "../../constants/http";
import { getError, ERROR_CODES } from "../Errors";
import NotehubLatestEvents from "./models/NotehubLatestEvents";
import NotehubSensorConfig from "./models/NotehubSensorConfig";
import NotehubErr from "./models/NotehubErr";
import NotehubEvent from "./models/NotehubEvent";
import NotehubResponse from "./models/NotehubResponse";
import { Store } from "../contextualize";


export interface Context {
  hubDeviceUID: string;
  hubProjectUID: string;
  hubAuthToken: string;
}

// this class directly interacts with Notehub via HTTP calls
export default class AxiosHttpNotehubAccessor implements NotehubAccessor {

  store: Store<Context>;
  hubBaseURL: string;
  hubHistoricalDataStartDate: Date;

  commonHeaders;

  constructor(
    hubBaseURL: string,     store:Store<Context>,
    hubHistoricalDataStartDays: number
  ) {
    this.hubBaseURL = hubBaseURL;
    this.store = store;
    const date = new Date();
    date.setDate(date.getDate() - hubHistoricalDataStartDays);
    this.hubHistoricalDataStartDate = date;

    this.commonHeaders = {
      [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON
    };
    
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

    const endpoint = `${this.hubBaseURL}/v1/projects/${context.hubProjectUID}/devices/${context.hubDeviceUID}`;
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
    const endpoint = `${this.hubBaseURL}/v1/projects/${context.hubProjectUID}/devices/${hubDeviceUID}/latest`;
    const headers = Object.assign({[HTTP_HEADER.SESSION_TOKEN]: context.hubAuthToken}, this.commonHeaders);
    
    try {
      const resp = await axios.get(endpoint, { headers });
      return resp.data as NotehubLatestEvents;
    } catch (e) {
      throw this.errorWithCode(e);
    }
  }

  async getEvents(startDate?: Date) {
    // Take the start date from the argument first, but fall back to the environment
    // variable.
    const startDateToUse = startDate || this.hubHistoricalDataStartDate;
    const startDateValue = Math.round(startDateToUse.getTime() / 1000);
    const context = this.context();
    let events: NotehubEvent[] = [];
    const initialEndpoint = `${this.hubBaseURL}/v1/projects/${context.hubProjectUID}/events?startDate=${startDateValue}`;
    try {
      const resp: AxiosResponse<NotehubResponse> = await axios.get(
        initialEndpoint,
        { headers: this.commonHeaders }
      );
      if (resp.data.events) {
        events = resp.data.events;
      }
      while (resp.data.has_more) {
        const recurringEndpoint = `${this.hubBaseURL}/v1/projects/${context.hubProjectUID}/events?since=${resp.data.through}`;
        const recurringResponse: AxiosResponse<NotehubResponse> =
          // eslint-disable-next-line no-await-in-loop
          await axios.get(recurringEndpoint, { headers: this.commonHeaders });
        if (recurringResponse.data.events) {
          events = [...events, ...recurringResponse.data.events];
        }
        if (recurringResponse.data.has_more) {
          resp.data.through = recurringResponse.data.through;
        } else {
          resp.data.has_more = false;
        }
      }
      return events;
    } catch (e) {
      throw this.errorWithCode(e);
    }
  }

  async getConfig(hubDeviceUID: string, macAddress: string) {
    
    const context = this.context();
    const endpoint = `${this.hubBaseURL}/req?project=${context.hubProjectUID}&device=${hubDeviceUID}`;
    
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
