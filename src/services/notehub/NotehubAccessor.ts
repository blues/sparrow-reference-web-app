import NotehubDevice from "./models/NotehubDevice";

// An interface for accessing Notehub APIs
interface NotehubAccessor {
  getGateways: () => Promise<NotehubDevice[]>;
  getGateway: (hubDeviceUID: string) => Promise<NotehubDevice>;
}

// eslint-disable-next-line import/prefer-default-export
export type { NotehubAccessor };
