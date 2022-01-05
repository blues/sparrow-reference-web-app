import axios from "axios";
import { flattenDeep, uniqBy } from "lodash";
import Gateway from "../models/Gateway";
import Sensor from "../models/Sensor";
import NotehubLatestEvents from "../models/NotehubLatestEvents";
import NotehubEvent from "../models/NotehubEvent";
import config from "../../config";
import NotehubSensorConfig from "../models/NotehubSensorConfig";
import { SENSOR_MESSAGE } from "../constants/ui";

export default async function getLatestSensorData(gatewaysList: Gateway[]) {
  // get latest sensor data from API
  const getLatestSensorDataByGateway = async (gateway: Gateway) => {
    const resp = await axios.get(
      `${config.appBaseUrl}/api/gateway/${gateway.uid}/sensors`
    );

    const latestSensorEvents = resp.data as NotehubLatestEvents;

    // filter out all latest_events that are not `motion.qo` or `air.qo` files - those indicate they are sensor files
    const filteredSensorData = latestSensorEvents.latest_events.filter(
      (event: NotehubEvent) => {
        if (
          event.file.includes("#motion.qo") ||
          event.file.includes("#air.qo")
        ) {
          return true;
        }
        return false;
      }
    );

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

  /* if we have more than one gateway to get events for,
  loop through all the gateway UIDs and collect the events back */
  const getAllLatestSensorEvents = async (gateways: Gateway[]) =>
    Promise.all(gateways.map(getLatestSensorDataByGateway));

  const latestSensorEvents = await getAllLatestSensorEvents(gatewaysList);

  const simplifiedSensorEvents = uniqBy(
    flattenDeep(latestSensorEvents)
      .map((sensorEvent) => ({
        name: SENSOR_MESSAGE.NO_NAME,
        gatewayUID: sensorEvent.gatewayUID,
        macAddress: sensorEvent.macAddress.split("#")[0],
        humidity: sensorEvent?.humidity
          ? sensorEvent.humidity
          : SENSOR_MESSAGE.NO_HUMIDITY,
        pressure: sensorEvent?.pressure
          ? sensorEvent.pressure
          : SENSOR_MESSAGE.NO_PRESSURE,
        temperature: sensorEvent?.temperature
          ? sensorEvent.temperature
          : SENSOR_MESSAGE.NO_TEMPERATURE,
        voltage: sensorEvent?.voltage
          ? sensorEvent.voltage
          : SENSOR_MESSAGE.NO_VOLTAGE,
        lastActivity: sensorEvent.lastActivity,
      }))
      .filter((addr) => addr !== undefined),
    "macAddress"
  );

  // get the names of the sensors from the API via config.db
  const getExtraSensorDetails = async (gatewaySensorInfo: Sensor) => {
    const resp = await axios.get(
      `${config.appBaseUrl}/api/gateway/${gatewaySensorInfo.gatewayUID}/sensor/${gatewaySensorInfo.macAddress}/config`
    );
    const sensorNameInfo = resp.data as NotehubSensorConfig;

    // put it all together in one snapshot object
    return {
      macAddress: gatewaySensorInfo.macAddress,
      gatewayUID: gatewaySensorInfo.gatewayUID,
      name: sensorNameInfo?.body?.name
        ? sensorNameInfo.body.name
        : gatewaySensorInfo.name,
      voltage: gatewaySensorInfo.voltage,
      lastActivity: gatewaySensorInfo.lastActivity,
      humidity: gatewaySensorInfo.humidity,
      pressure: gatewaySensorInfo.pressure,
      temperature: gatewaySensorInfo.temperature,
    };
  };

  const getAllSensorData = async (gatewaySensorInfo: Sensor[]) =>
    Promise.all(gatewaySensorInfo.map(getExtraSensorDetails));

  const allLatestSensorData = await getAllSensorData(simplifiedSensorEvents);

  return allLatestSensorData;
}
