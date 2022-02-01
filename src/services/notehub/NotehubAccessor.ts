import NotehubDevice from "./models/NotehubDevice";
import NotehubEvent from "./models/NotehubEvent";
import NotehubLatestEvents from "./models/NotehubLatestEvents";
import NotehubSensorConfig from "./models/NotehubSensorConfig";

// An interface for accessing Notehub APIs
interface NotehubAccessor {
  getDevices: () => Promise<NotehubDevice[]>;
  getDevice: (hubDeviceUID: string) => Promise<NotehubDevice>;
  getLatestEvents: (hubDeviceUID: string) => Promise<NotehubLatestEvents>;
  getHistoricalEvents: (
    hubHistoricalDataStartDate?: number
  ) => Promise<NotehubEvent[]>;
  getConfig: (
    hubDeviceUID: string,
    macAddress: string
  ) => Promise<NotehubSensorConfig>;
}

// eslint-disable-next-line import/prefer-default-export
export type { NotehubAccessor };
