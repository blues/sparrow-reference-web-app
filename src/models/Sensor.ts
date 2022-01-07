// Device

import Device from './Device';


// rename to SensorDevice?
interface Sensor extends Device {
  // why not allow gateways to have a name too?
  name: string;
  // all devices have a
  macAddress: string;

  // these sensors
  humidity: number | string;
  pressure: number | string;
  temperature: number | string;
  voltage: number | string;
  

  gatewayUID: string;
}

export default Sensor;
