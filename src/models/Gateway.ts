interface Gateway {
  uid: string;
  serial_number: string;
  last_activity: string;
  tower_location: string;
  location?: string;
  voltage: number;
}

export default Gateway;
