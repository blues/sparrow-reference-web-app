import axios from "axios";
import Gateway from "../models/Gateway";
import config from "../../config";
import NotehubDevice from "../models/NotehubDevice";

export function notehubToSparrow(device: NotehubDevice) {
  return {
    lastActivity: device.last_activity,
    ...((device?.triangulated_location || device?.tower_location) && {
      location: device?.triangulated_location?.name
        ? device.triangulated_location.name
        : device.tower_location?.name,
    }),
    serialNumber: device.serial_number,
    uid: device.uid,
    voltage: device.voltage,
  };
}

export async function getGateways() {
  const gateways: Gateway[] = [];

  const resp = await axios.get(
    `${config.appBaseUrl}/api/gateways/${config.hubDeviceUID}`
  );
  const json = resp.data as NotehubDevice;
  const gateway = notehubToSparrow(json);
  gateways.push(gateway);

  return gateways;
}

export async function getGateway(gatewayUID: string) {
  const resp = await axios.get(
    `${config.appBaseUrl}/api/gateways/${gatewayUID}`
  );
  const json = resp.data as NotehubDevice;

  return notehubToSparrow(json);
}
