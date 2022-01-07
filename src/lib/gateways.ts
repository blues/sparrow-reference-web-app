import axios from "axios";
import Gateway from "../models/Gateway";
import config from "../../config";
import NotehubDevice from "./notehub/NotehubDevice";
import NotehubApiService from "./NotehubApi";

const notehubApi: NotehubApiService;




export default async function getGateways() {
  const gateways: Gateway[] = [];

  const resp = await notehubApi.getGateways();
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
