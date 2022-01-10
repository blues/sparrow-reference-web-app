import Gateway from "../../models/Gateway";
import Sensor from "../../models/Sensor";
import { DataProvider } from "../interfaces/DataProvider";

// todo decide if we need this level of abstraction
export default class NotehubProvider implements DataProvider {
  getGateways: (deviceID: string) => Promise<Gateway[]>;

  getLatestSensorData: (gatewaysList: Gateway[]) => Promise<Sensor[]>;
}
