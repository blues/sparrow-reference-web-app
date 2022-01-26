import axios from "axios";
import { flattenDeep, uniqBy } from "lodash";
import Gateway from "../components/models/Gateway";
import Sensor from "../components/models/Sensor";
import NotehubLatestEvents from "./notehub/models/NotehubLatestEvents";
import NotehubEvent from "./notehub/models/NotehubEvent";
import Config from "../../config";
import { HTTP_STATUS } from "../constants/http";
import NotehubSensorConfig from "./notehub/models/NotehubSensorConfig";

// todo refactor in future story
export default async function getLatestSensorData(gatewaysList: Gateway[]) {
  // get latest sensor data from API
  const getLatestSensorDataByGateway = async (gateway: Gateway) => {
    console.log(
      "Get latest sensor data endpoint ",
      `${Config.appBaseUrl}/api/gateway/${gateway.uid}/sensors`
    );
    const resp = await axios.get(
      `${Config.appBaseUrl}/api/gateway/${gateway.uid}/sensors`
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
      humidity: event.body.humidity,
      pressure: event.body.pressure,
      temperature: event.body.temperature,
      voltage: event.body.voltage,
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
        name: undefined,
        gatewayUID: sensorEvent.gatewayUID,
        macAddress: sensorEvent.macAddress.split("#")[0],
        humidity: sensorEvent.humidity,
        pressure: sensorEvent.pressure,
        temperature: sensorEvent.temperature,
        voltage: sensorEvent.voltage,
        lastActivity: sensorEvent.lastActivity,
      }))
      .filter((addr) => addr !== undefined),
    "macAddress"
  );

  // get the names of the sensors from the API via config.db
  const getExtraSensorDetails = async (gatewaySensorInfo: Sensor) => {
    try {
      const resp = await axios.get(
        `${Config.appBaseUrl}/api/gateway/${gatewaySensorInfo.gatewayUID}/sensor/${gatewaySensorInfo.macAddress}/config`
      );
      const sensorNameInfo = resp?.data as NotehubSensorConfig;
      // put it all together in one object
      return {
        macAddress: gatewaySensorInfo.macAddress,
        gatewayUID: gatewaySensorInfo.gatewayUID,
        ...(sensorNameInfo?.body?.name && { name: sensorNameInfo.body.name }),
        ...(gatewaySensorInfo.voltage && {
          voltage: gatewaySensorInfo.voltage,
        }),
        lastActivity: gatewaySensorInfo.lastActivity,
        ...(gatewaySensorInfo.humidity && {
          humidity: gatewaySensorInfo.humidity,
        }),
        ...(gatewaySensorInfo.pressure && {
          pressure: gatewaySensorInfo.pressure,
        }),
        ...(gatewaySensorInfo.temperature && {
          temperature: gatewaySensorInfo.temperature,
        }),
      } as Sensor;
    } catch (err) {
      // this is only one of probably many potential error scenarios we'll have to handle
      // if user's unauthorized to see Notehub project, break early and display error in the UI
      throw new Error(HTTP_STATUS.UNAUTHORIZED);
    }
  };

  const getAllSensorData = async (gatewaySensorInfo: Sensor[]) =>
    Promise.all(gatewaySensorInfo.map(getExtraSensorDetails));

  const allLatestSensorData = await getAllSensorData(simplifiedSensorEvents);

  return allLatestSensorData;
}
