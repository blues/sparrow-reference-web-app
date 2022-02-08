import Gateway from "../components/models/Gateway";
import Sensor from "../components/models/Sensor";

// this interface shows gateway or sensor data - nothing more, nothing less
interface DataProvider {
  getGateways: () => Promise<Gateway[]>;

  getGateway: (gatewayUID: string) => Promise<Gateway>;

  getLatestSensorData: (gateways: Gateway[]) => Promise<Sensor[]>;
}

// eslint-disable-next-line import/prefer-default-export
export type { DataProvider };
