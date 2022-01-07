// Device
import Device from "./Device";

// rename to SensorDevice?
interface Sensor extends Device {
  // why not allow gateways to have a name too?
  name?: string;
  // all devices have a
  macAddress: string;

  // these sensors
  humidity?: number;
  pressure?: number;
  temperature?: number;
  voltage?: number;

  lastActivity: string;
  gatewayUID: string;
}

export default Sensor;
