import Gateway from "../../models/Gateway";
import Sensor from "../../models/Sensor";

// todo decide if we need this level of abstraction
interface DataProvider {
  getGateways: (deviceID: string) => Promise<Gateway[]>;
  // placholder method for future story
  getLatestSensorData: (gatewaysList: Gateway[]) => Promise<Sensor[]>;
}

// eslint-disable-next-line import/prefer-default-export
export type { DataProvider };
