import Gateway from "../../components/models/Gateway";
import Sensor from "../../components/models/Sensor";

// todo decide if we need this level of abstraction
// just shows gateway or sensor data
interface DataProvider {
  getGateways: () => Promise<Gateway[]>;
  // placholder method for future story
  // getSensorData: (gatewaysList: Gateway[]) => Promise<Sensor[]>;
}

// eslint-disable-next-line import/prefer-default-export
export type { DataProvider };
