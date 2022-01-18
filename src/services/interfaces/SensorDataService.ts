import Sensor from "../../components/models/Sensor";
import Gateway from "../../components/models/Gateway";

interface SensorDataService {
  // placholder method for future story
  getLatestSensorData: (gatewaysList: Gateway[]) => Promise<Sensor[]>;
}

// eslint-disable-next-line import/prefer-default-export
export type { SensorDataService };
