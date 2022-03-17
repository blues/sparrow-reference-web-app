import axios, { AxiosResponse } from "axios";
import { ErrorWithCause } from "pony-cause";
import { NotehubAccessor } from "./NotehubAccessor";
import NotehubDevice from "./models/NotehubDevice";
import { HTTP_HEADER } from "../../constants/http";
import { getError, ERROR_CODES } from "../Errors";
import NotehubLatestEvents from "./models/NotehubLatestEvents";
import NotehubNodeConfig from "./models/NotehubNodeConfig";
import NotehubErr from "./models/NotehubErr";
import NotehubEvent from "./models/NotehubEvent";
import NotehubResponse from "./models/NotehubResponse";
import NoteNodeConfigBody from "./models/NoteNodeConfigBody";
import NotehubEnvVars from "./models/NotehubEnvVars";
import { getEpochChartDataDate } from "../../components/presentation/uiHelpers";
import FormData from "form-data";

type HubAuth = { id: string; secret: string };

// this class directly interacts with Notehub via HTTP calls
export default class AxiosHttpNotehubAccessor implements NotehubAccessor {
  private commonHeaders;

  private authBearerToken = "";

  constructor(
    private hubAuth: HubAuth,
    private hubBaseURL: string,
    private hubDeviceUID: string,
    private hubProjectUID: string,
    private hubHistoricalDataRecentMinutes: number
  ) {
    this.commonHeaders = {
      [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
    };
    this.renewAuthToken(this.hubBaseURL, this.hubAuth.id, this.hubAuth.secret)
      .then((token) => {
        this.commonHeaders[HTTP_HEADER.SESSION_TOKEN] = token + "f";
      })
      .catch((cause: unknown) => {
        throw new ErrorWithCause("Could not renew Auth Token", { cause });
      });
  }

  async renewAuthToken(baseUrl: string, id: string, secret: string) {
    /* $ curl --request POST   --url 'https://notehub.io/hydra/oauth2/token' --header 'content-type:
    application/x-www-form-urlencoded'   --data grant_type=client_credentials   --data
    client_id=7ad0d82d-457e-467d-86ec-67a77714585b   --data
    client_secret=c2fb797c547ee1a82f899c8a8a4a61656d13586dc542e6a626d488b3b9fa8020
    {"access_token":"RupfnwD1igcQdmHhLtSWSjhDwid4QBUBjUtudhyKhXc.23QQjhw_4pUSvFzI7IcYENGnh5GPl6fQsIsBbynRRLY",
    "expires_in":1799,"scope":"","token_type":"bearer"}
    */
    const endpoint = `${this.hubBaseURL}/oauth2/token`;
    const form = new FormData();
    form.append("grant_type", "client_credentials");
    form.append("client_id", id);
    form.append("client_secret", secret);
    type OAuthTokenResponse = {
      access_token: string;
      expires_in: number;
      scope: string;
      token_type: string;
    };

    const resp = await axios.post<OAuthTokenResponse>(endpoint, form, {
      headers: form.getHeaders(),
    });
    this.authBearerToken = resp.data.access_token;
    console.log("token: ", this.authBearerToken);
    return resp.data.access_token;
  }

  async getAllDevices(deviceUIDs: string[]) {
    return Promise.all(deviceUIDs.map((device) => this.getDevice(device)));
  }

  // Eventually we’ll want to find all valid gateways in a Notehub project.
  // For now, just take the hardcoded list of gateway UID from the starter’s
  // environment variables and use that.
  async getDevices() {
    const deviceUIDs = this.hubDeviceUID.split(",");
    const allDeviceData = await this.getAllDevices(deviceUIDs);
    return allDeviceData;
  }

  async getDevice(hubDeviceUID: string) {
    const endpoint = `${this.hubBaseURL}/v1/projects/${this.hubProjectUID}/devices/${hubDeviceUID}`;
    console.log(endpoint);
    try {
      const resp = await axios.get(endpoint, { headers: this.commonHeaders });
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
    const endpoint = `${this.hubBaseURL}/v1/projects/${this.hubProjectUID}/devices/${hubDeviceUID}/latest`;
    try {
      const resp = await axios.get(endpoint, { headers: this.commonHeaders });
      return resp.data as NotehubLatestEvents;
    } catch (e) {
      throw this.errorWithCode(e);
    }
  }

  async getEvents(startDate?: string) {
    // start date is an epoch time string to avoid TS error when it's passed into Notehub URL
    const startDateValue =
      startDate || getEpochChartDataDate(this.hubHistoricalDataRecentMinutes);

    // Take the start date from the argument first, but fall back to the environment
    // variable.
    let events: NotehubEvent[] = [];
    const initialEndpoint = `${this.hubBaseURL}/v1/projects/${this.hubProjectUID}/events?startDate=${startDateValue}`;
    try {
      const resp: AxiosResponse<NotehubResponse> = await axios.get(
        initialEndpoint,
        { headers: this.commonHeaders }
      );
      if (resp.data.events) {
        events = resp.data.events;
      }
      while (resp.data.has_more && resp.data.through) {
        const recurringEndpoint = `${this.hubBaseURL}/v1/projects/${this.hubProjectUID}/events?since=${resp.data.through}`;
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

  async getConfig(hubDeviceUID: string, nodeId: string) {
    const endpoint = `${this.hubBaseURL}/req?project=${this.hubProjectUID}&device=${hubDeviceUID}`;
    const body = {
      req: "note.get",
      file: "config.db",
      note: nodeId,
    };
    let resp;
    try {
      resp = await axios.post(endpoint, body, {
        headers: this.commonHeaders,
      });
    } catch (e) {
      throw getError(ERROR_CODES.INTERNAL_ERROR, { cause: e as Error });
    }
    if ("err" in resp.data) {
      const { err } = resp.data as NotehubErr;

      if (err.includes("note-noexist")) {
        // Because the mac address cannot be found the API will return a
        // “note-noexist” error, which we ignore because that just means
        // the sensor does not have a name / location yet.
      } else if (err.includes("device-noexist")) {
        throw getError(ERROR_CODES.DEVICE_NOT_FOUND);
      } else if (err.includes("insufficient permissions")) {
        throw getError(ERROR_CODES.FORBIDDEN);
      } else {
        throw getError(ERROR_CODES.INTERNAL_ERROR);
      }
    }
    return resp.data as NotehubNodeConfig;
  }

  async setConfig(
    hubDeviceUID: string,
    nodeId: string,
    body: NoteNodeConfigBody
  ) {
    const endpoint = `${this.hubBaseURL}/req?project=${this.hubProjectUID}&device=${hubDeviceUID}`;
    const req = {
      req: "note.update",
      file: "config.db",
      note: nodeId,
      body,
    };
    let resp;
    try {
      resp = await axios.post(endpoint, req, {
        headers: this.commonHeaders,
      });
    } catch (cause) {
      throw new ErrorWithCause(ERROR_CODES.INTERNAL_ERROR, { cause });
    }
    if ("err" in resp.data) {
      const { err } = resp.data as NotehubErr;

      if (err.includes("device-noexist")) {
        throw getError(ERROR_CODES.DEVICE_NOT_FOUND);
      } else if (err.includes("note-noexist")) {
        throw getError(ERROR_CODES.NODE_NOT_FOUND);
      } else if (err.includes("insufficient permissions")) {
        throw getError(ERROR_CODES.FORBIDDEN);
      } else {
        throw getError(`${ERROR_CODES.INTERNAL_ERROR}: ${err}`);
      }
    }
    return true;
  }

  async setEnvironmentVariables(hubDeviceUID: string, envVars: NotehubEnvVars) {
    const endpoint = `${this.hubBaseURL}/v1/projects/${this.hubProjectUID}/devices/${hubDeviceUID}/environment_variables`;
    try {
      await axios.put(
        endpoint,
        { environment_variables: envVars },
        { headers: this.commonHeaders }
      );
    } catch (e) {
      throw this.errorWithCode(e);
    }
    return true;
  }
}
