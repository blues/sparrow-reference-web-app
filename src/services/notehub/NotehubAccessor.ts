import NotehubDevice from "./models/NotehubDevice";
import NotehubLatestEvents from "./models/NotehubLatestEvents";
import NotehubSensorConfig from "./models/NotehubSensorConfig";

// this interface overlays the HttpNotehubApiService file
interface NotehubAccessor {
  getGateways: () => Promise<NotehubDevice[]>;
  getGateway: (hubDeviceUID: string) => Promise<NotehubDevice>;
  getLatestEvents: (hubDeviceUID: string) => Promise<NotehubLatestEvents>;
  getConfig: (
    hubDeviceUID: string,
    macAddress: string
  ) => Promise<NotehubSensorConfig>;
}

// eslint-disable-next-line import/prefer-default-export
export type { NotehubAccessor };
