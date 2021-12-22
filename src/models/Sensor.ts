interface Sensor {
  name: string;
  macAddress: string;
  humidity: number | string;
  pressure: number | string;
  temperature: number | string;
  voltage: number | string;
  lastActivity: string;
  gatewayUID: string;
}

export default Sensor;
