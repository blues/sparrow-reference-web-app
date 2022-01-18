import NotehubDevice from "../notehub/models/NotehubDevice";

// this interface overlays the HttpNotehubApiService file
interface NotehubApiService {
  getGateways: (hubDeviceUID: string) => Promise<NotehubDevice>;
}

// eslint-disable-next-line import/prefer-default-export
export type { NotehubApiService };
