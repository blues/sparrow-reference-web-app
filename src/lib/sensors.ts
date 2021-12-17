import axios from "axios";
import Gateway from "../models/Gateway";
import Sensor from "../models/Sensor";
import config from "../../config";

export default async function getSensors(gatewayData: Gateway[]) {
  // Using mock data for now. What we need to do is get the latest events,
  // loop through them to find all unique mac addresses (in the "file" field).
  // Then, for each unique sensor, make a call to /sensor/[macAddress]/config
  // to get the device’s name—and combine all that into the structure below.
  const mockSensors: Sensor[] = [
    {
      name: "0F Furnace",
      macAddress: "20323746323650020031002f",
      humidity: 27.234375,
      pressure: 101152,
      temperature: 22.6875,
      voltage: 2.733,
      lastActivity: "2021-11-30T20:30:19Z",
      gatewayUID: "dev:868050040065365",
    },
    {
      name: "1F Atrium",
      macAddress: "203237343323650020031002f",
      humidity: 25.2343425,
      pressure: 121352,
      temperature: 24.1243,
      voltage: 3.733,
      lastActivity: "2021-11-30T20:30:19Z",
      gatewayUID: "dev:868050040065365",
    },
  ];

  const macAddresses: [] = [];

  const getMacAddressData = async (gateway: Gateway) => {
    const macAddressResp = await axios.get(
      `${config.appBaseUrl}/api/gateway/${gateway.uid}/sensors`
    );
    return macAddressResp.data;
  };

  /* if we have more than one gateway to get mac addresses for,
  loop through all the gateway UIDs and collect the latest events back */
  const getAllMacAddressEvents = (gateways: Gateway[]) =>
    Promise.all(gateways.map(getMacAddressData));

  const events = await getAllMacAddressEvents(gatewayData);
  console.log(events);

  return mockSensors;
}
