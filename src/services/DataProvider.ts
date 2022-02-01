import Gateway from "../components/models/Gateway";
import Sensor from "../components/models/Sensor";
import SensorReading from "../components/models/SensorReading";

// this interface shows gateway or sensor data - nothing more, nothing less
interface DataProvider {
  getGateways: () => Promise<Gateway[]>;

  getGateway: (gatewayUID: string) => Promise<Gateway>;

  getSensors: (gatewayUIDs: string[]) => Promise<Sensor[]>;

  getSensor: (gatewayUID: string, sensorUID: string) => Promise<Sensor>;

  getSensorData: (
    gatewayUID: string,
    sensorUID: string,
    options?: {
      startDate?: Date;
    }
  ) => Promise<SensorReading[]>;
}

// eslint-disable-next-line import/prefer-default-export
export type { DataProvider };
