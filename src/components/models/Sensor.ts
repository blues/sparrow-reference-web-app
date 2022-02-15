interface Sensor {
  name?: string;
  macAddress: string;
  location?: string;
  humidity?: number;
  pressure?: number;
  temperature?: number;
  voltage?: number;
  lastActivity: string;
  gatewayUID: string;
}

export default Sensor;
