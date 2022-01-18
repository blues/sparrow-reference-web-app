import NotehubDevice from "./models/NotehubDevice";

// this interface overlays the HttpNotehubApiService file
interface NotehubApiService {
  getGateway: (hubDeviceUID: string) => Promise<NotehubDevice>;
}

// eslint-disable-next-line import/prefer-default-export
export type { NotehubApiService };
