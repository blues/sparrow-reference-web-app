import axios from "axios";
import { flattenDeep, uniqBy } from "lodash";
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

  // todo rename ALL variables here
  // 1. Get mac addresses on the API side

  const getMacAddressData = async (gateway: Gateway) => {
    const { data } = await axios.get(
      `${config.appBaseUrl}/api/gateway/${gateway.uid}/sensors`
    );

    const gatewayMacAddress = data.latest_events.map((event) => ({
      gatewayUID: `${gateway.uid}`,
      macAddress: event.file,
    }));
    return gatewayMacAddress;
  };

  /* if we have more than one gateway to get mac addresses for,
  loop through all the gateway UIDs and collect the latest events back */
  const getAllMacAddressEvents = async (gateways: Gateway[]) =>
    Promise.all(gateways.map(getMacAddressData));

  const allSensorEvents = await getAllMacAddressEvents(gatewayData);
  // console.log("ALL SENSOR DATA", allSensorEvents);

  const macAddresses = uniqBy(
    flattenDeep(allSensorEvents)
      .map((macAddrObj) => {
        if (macAddrObj.macAddress.includes("#")) {
          const splitString: string = macAddrObj.macAddress.split("#");
          const macAddress: string = splitString[0];
          return {
            gatewayUID: macAddrObj.gatewayUID,
            macAddress,
          };
        }
      })
      .filter((addr) => addr !== undefined),
    "macAddress"
  );

  console.log("UNIQUE mac addresses ", macAddresses);

  // 2. Get the sensor.db events from the API via the mac addresses
  // using note.get API call - add sensor.db api stub
  // 3. Get the names of the sensors from the API via config.db also using mac addresses
  // still using the note.get API call
  const getSensorData = async (gatewaySensorInfo: Sensor) => {
    const sensorDbInfo = await axios.get(
      `${config.appBaseUrl}/api/gateway/${gatewaySensorInfo.gatewayUID}/sensor/${gatewaySensorInfo.macAddress}/sensors`
    );
    const sensorNameInfo = await axios.get(
      `${config.appBaseUrl}/api/gateway/${gatewaySensorInfo.gatewayUID}/sensor/${gatewaySensorInfo.macAddress}/config`
    );
    const lastActivity: string =
      sensorDbInfo.data.when > sensorNameInfo.data.time
        ? sensorDbInfo.data.when
        : sensorNameInfo.data.time;

    // 4. Mix it all together and make it look like our mocked data
    return {
      macAddress: gatewaySensorInfo.macAddress,
      gatewayUID: gatewaySensorInfo.gatewayUID,
      name: sensorNameInfo.data.body.name,
      voltage: sensorDbInfo.data.body.voltage,
      lastActivity,
      humidity: 27.234375,
      pressure: 101152,
      temperature: 22.6875,
    };
  };

  const getAllSensorData = async (gatewaySensorInfo: Sensor[]) =>
    Promise.all(gatewaySensorInfo.map(getSensorData));

  const allSensorData = await getAllSensorData(macAddresses);

  return allSensorData;
}
