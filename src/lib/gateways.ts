import axios from "axios";
import Gateway from "../models/Gateway";

interface Location {
  when: string;
  name: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
}

interface GatewayResponse {
  uid: string;
  serial_number: string;
  provisioned: string;
  last_activity: string;
  contact: string;
  product_uid: string;
  fleet_uids: string[];
  tower_location?: Location;
  gps_location?: Location;
  triangulated_location: Location;
  voltage: number;
  temperature: number;
}

export default async function getGateways() {
  const gateways: Gateway[] = [];

  const resp = await axios.get("http://localhost:4000/api/gateways");
  const json = resp.data as GatewayResponse;

  const gateway = {
    lastActivity: json.last_activity,
    location: json.tower_location?.name,
    serialNumber: json.serial_number,
    uid: json.uid,
    voltage: json.voltage,
  };
  gateways.push(gateway);

  return gateways;
}
