import axios from "axios";
import Gateway from "../models/Gateway";
import config from "../../config";
import NotehubDevice from "../models/NotehubDevice";

export default async function getGateways() {
  const gateways: Gateway[] = [];

  const resp = await axios.get(
    `${config.appBaseUrl}/api/gateways/${config.hubDeviceUID}`
  );
  const json = resp.data as NotehubDevice;

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
