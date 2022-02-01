import Gateway from "../components/models/Gateway";
import Sensor from "../components/models/Sensor";
import SensorReading from "../components/models/SensorReading";
import NotehubEvent from "./notehub/models/NotehubEvent";

// this interface shows gateway or sensor data - nothing more, nothing less
interface DataProvider {
  getGateways: () => Promise<Gateway[]>;

  getGateway: (gatewayUID: string) => Promise<Gateway>;

  getSensors: (gatewayUIDs: string[]) => Promise<Sensor[]>;

  getSensor: (gatewayUID: string, sensorUID: string) => Promise<Sensor>;

  /*
  TODO: Implement
  getSensorData: (
    gatewayUID: string,
    sensorUID: string,
    options?: {
      key?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ) => Promise<SensorReading[]>;
  */

  getHistoricalSensorData: (
    gatewayUID: string,
    sensorUID: string
  ) => Promise<NotehubEvent[]>;
}

// eslint-disable-next-line import/prefer-default-export
export type { DataProvider };
