import Sensor from "./Sensor";

interface Gateway {
  uid: string;
  serialNumber: string;
  lastActivity: string;
  location?: string;
  voltage: number;
  sensorList: Sensor[];
}

export default Gateway;
