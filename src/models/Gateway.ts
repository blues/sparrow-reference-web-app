interface Gateway {
  uid: string;
  serialNumber: string;
  lastActivity: string;
  location?: string;
  voltage: number;
}

export default Gateway;
