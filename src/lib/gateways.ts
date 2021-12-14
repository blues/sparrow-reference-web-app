import Gateway from "../models/Gateway";

export async function getGateways() {
  const gateways: Gateway[] = [];

  const resp = await fetch("http://localhost:4000/api/gateways");
  const json = await resp.json();
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
