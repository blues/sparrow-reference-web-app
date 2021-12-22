import axios from "axios";
import { flattenDeep, uniqBy } from "lodash";
import Gateway from "../models/Gateway";
import Sensor from "../models/Sensor";
import NotehubEvents from "../models/NotehubEvents";
import config from "../../config";

export default async function getSensors(gatewaysList: Gateway[]) {
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
  // 1. Get mac addresses and latest sensor data on the API side

  const getLatestSensorDataByGateway = async (gateway: Gateway) => {
    const resp = await axios.get(
      `${config.appBaseUrl}/api/gateway/${gateway.uid}/sensors`
    );

    const latestSensorEvents = resp.data as NotehubEvents;

    // filter out all latest_events that are not `motion.qo` or `air.qo` files - those indicate they are sensor files
    const filteredSensorData = latestSensorEvents.filter(
      (event: NotehubEvent) => {
        if (
          event.file.includes("#motion.qo") ||
          event.file.includes("#air.qo")
        ) {
          return event;
        }
      }
    );
    // console.log(filteredSensorData);

    const latestSensorData = filteredSensorData.map((event) => ({
      gatewayUID: `${gateway.uid}`,
      macAddress: event.file,
      humidity: event.body?.humidity,
      pressure: event.body?.pressure,
      temperature: event.body?.temperature,
      voltage: event.body?.voltage,
      lastActivity: event.captured,
    }));
    return latestSensorData;
  };

  /* if we have more than one gateway to get mac addresses for,
  loop through all the gateway UIDs and collect the latest events back */
  const getAllLatestSensorEvents = async (gateways: Gateway[]) =>
    Promise.all(gateways.map(getLatestSensorDataByGateway));

  const latestSensorEvents = await getAllLatestSensorEvents(gatewaysList);
  // console.log("ALL SENSOR DATA", latestSensorEvents);

  const simplifiedSensorEvents = uniqBy(
    flattenDeep(latestSensorEvents)
      .map(
        (sensorEvent) => ({
          gatewayUID: sensorEvent.gatewayUID,
          macAddress: sensorEvent.macAddress.split("#")[0],
          humidity: sensorEvent?.humidity,
          pressure: sensorEvent?.pressure,
          temperature: sensorEvent?.temperature,
          voltage: sensorEvent?.voltage,
          lastActivity: sensorEvent?.lastActivity,
        })
        // }
      )
      .filter((addr) => addr !== undefined),
    "macAddress"
  );

  // console.log("UNIQUE mac addresses ", simplifiedSensorEvents);

  // 2. Get the sensor.db events from the API via the mac addresses
  // using note.get API call - add sensor.db api stub
  // 3. Get the names of the sensors from the API via config.db also using mac addresses
  // still using the note.get API call
  const getExtraSensorDetails = async (gatewaySensorInfo: Sensor) => {
    const sensorNameInfo = await axios.get(
      `${config.appBaseUrl}/api/gateway/${gatewaySensorInfo.gatewayUID}/sensor/${gatewaySensorInfo.macAddress}/config`
    );

    // console.log(sensorNameInfo.data);

    // 4. Mix it all together and make it look like our mocked data
    return {
      macAddress: gatewaySensorInfo.macAddress,
      gatewayUID: gatewaySensorInfo.gatewayUID,
      name: sensorNameInfo.data.body.name
        ? sensorNameInfo.data.body.name
        : "No sensor name currently set.",
      voltage: gatewaySensorInfo.voltage
        ? gatewaySensorInfo.voltage
        : "No voltage readings currently available.",
      lastActivity: gatewaySensorInfo.lastActivity,
      humidity: gatewaySensorInfo.humidity
        ? gatewaySensorInfo.humidity
        : "No humidity readings currently available.",
      pressure: gatewaySensorInfo.pressure
        ? gatewaySensorInfo.pressure
        : "No pressure readings currently available.",
      temperature: gatewaySensorInfo.temperature
        ? gatewaySensorInfo.temperature
        : "No temperature readings currently available.",
    };
  };

  const getAllSensorData = async (gatewaySensorInfo: Sensor[]) =>
    Promise.all(gatewaySensorInfo.map(getExtraSensorDetails));

  const allSensorData = await getAllSensorData(simplifiedSensorEvents);

  return allSensorData;
}
