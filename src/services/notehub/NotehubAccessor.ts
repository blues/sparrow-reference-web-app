import NotehubDevice from "./models/NotehubDevice";

// this interface overlays the HttpNotehubApiService file
interface NotehubAccessor {
  getGateways: () => Promise<NotehubDevice[]>;
  getGateway: (hubDeviceUID: string) => Promise<NotehubDevice>;
}

// eslint-disable-next-line import/prefer-default-export
export type { NotehubAccessor };
