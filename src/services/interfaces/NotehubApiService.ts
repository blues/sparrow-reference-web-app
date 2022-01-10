import NotehubDevice from "../notehub/models/NotehubDevice";

interface NotehubApiService {
  getGateways: (hubDeviceUID: string) => Promise<NotehubDevice>;
}

// eslint-disable-next-line import/prefer-default-export
export type { NotehubApiService };
