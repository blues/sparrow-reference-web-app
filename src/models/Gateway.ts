
import Device from "./Device";

interface Gateway extends Device {
  uid: string;
  serialNumber: string;
  location?: string;
  voltage: number;
}

export default Gateway;
