import axios from 'axios';
import Gateway from "../models/Gateway";

export default async function getGateways() {
  const gateways: Gateway[] = [];

  const resp = await axios.get("http://localhost:4000/api/gateways");
  const json = resp.data as Gateway;

  const gateway = {
    last_activity: json.last_activity,
    tower_location: json.tower_location,
    serial_number: json.serial_number,
    uid: json.uid,
    voltage: json.voltage,
  };
  gateways.push(gateway);

  return gateways;
}
