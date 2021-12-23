import axios from "axios";
import { uniqBy } from "lodash";
import Gateway from "../models/Gateway";
import Sensor from "../models/Sensor";
import NotehubEvents from "../models/NotehubEvents";
import NotehubEvent from "../models/NotehubEvent";
import config from "../../config";
import NotehubSensorConfig from "../models/NotehubSensorConfig";
import { SENSOR_MESSAGE } from "../constants/ui";

export default async function getSensorDetailsData(
  gatewayUID: string,
  sensorUID: string
) {
  // Get all latest sensor data from API
  const getLatestSensorData = async (gatewayUID: string) => {
    const resp = await axios.get(
      `${config.appBaseUrl}/api/gateway/${gatewayUID}/sensors`
    );

    const latestSensorEvents = resp.data as NotehubEvents;

    // filter out all latest_events that do not match sensorUID
    const filteredSensorData = latestSensorEvents.latest_events.filter(
      (event: NotehubEvent) => {
        if (event.file.includes(`${sensorUID}`)) {
          return event;
        }
      }
    );

    // get sensor name detail from config.db file
    const sensorDetails = await axios.get(
      `${config.appBaseUrl}/api/gateway/${gatewayUID}/sensor/${sensorUID}/config`
    );

    // todo handle failure state once Rob's branch merged in
    const sensorNameInfo = sensorDetails.data as NotehubSensorConfig;

    // combine the sensor data objs into one
    const latestSensorDataObj = uniqBy(
      filteredSensorData.map((event) => ({
        gatewayUID: `${gatewayUID}`,
        macAddress: `${sensorUID}`,
        name: sensorNameInfo.body.name,
        humidity: event.body?.humidity
          ? event.body.humidity
          : SENSOR_MESSAGE.NO_HUMIDITY,
        pressure: event.body?.pressure
          ? event.body.pressure
          : SENSOR_MESSAGE.NO_PRESSURE,
        temperature: event.body?.temperature
          ? event.body.temperature
          : SENSOR_MESSAGE.NO_TEMPERATURE,
        voltage: event.body?.voltage
          ? event.body.voltage
          : SENSOR_MESSAGE.NO_VOLTAGE,
        lastActivity: event.captured,
      })),
      "macAddress"
    );
    // there should only ever be one obj in the array when it's done
    return latestSensorDataObj[0];
  };

  const latestSensorData = await getLatestSensorData(gatewayUID);

  const getHistoricalSensorData = async (gatewayUID: string) => {
    const resp = await axios.get(
      `${config.appBaseUrl}/api/gateway/${gatewayUID}/historicalSensors`
    );

    const sensorEvents = resp.data as NotehubEvents;
    console.log("SENSOR EVENTS----------", sensorEvents);
    // todo WIP commit filter out all events that are not related to the gateway and sensor UID

    // filter out all latest_events that do not match sensorUID and gatewayUID
    // const filteredSensorData = latestSensorEvents.latest_events.filter(
    //   (event: NotehubEvent) => {
    //     if (event.file.includes(`${sensorUID}`)) {
    //       return event;
    //     }
    //   }
    // );

    // // get sensor name detail from config.db file
    // const sensorDetails = await axios.get(
    //   `${config.appBaseUrl}/api/gateway/${gatewayUID}/sensor/${sensorUID}/config`
    // );

    // const sensorNameInfo = sensorDetails.data as NotehubSensorConfig;

    // // combine the sensor data objs into one
    // const latestSensorDataObj = uniqBy(
    //   filteredSensorData.map((event) => ({
    //     gatewayUID: `${gatewayUID}`,
    //     macAddress: `${sensorUID}`,
    //     name: sensorNameInfo.body.name,
    //     humidity: event.body?.humidity
    //       ? event.body.humidity
    //       : SENSOR_MESSAGE.NO_HUMIDITY,
    //     pressure: event.body?.pressure
    //       ? event.body.pressure
    //       : SENSOR_MESSAGE.NO_PRESSURE,
    //     temperature: event.body?.temperature
    //       ? event.body.temperature
    //       : SENSOR_MESSAGE.NO_TEMPERATURE,
    //     voltage: event.body?.voltage
    //       ? event.body.voltage
    //       : SENSOR_MESSAGE.NO_VOLTAGE,
    //     lastActivity: event.captured,
    //   })),
    //   "macAddress"
    // );
    // // there should only ever be one obj in the array when it's done
    // return latestSensorDataObj[0];
  };

  // Get historical data from API for charts - default to past 5 days (for now)
  const historicalSensorData = await getHistoricalSensorData(gatewayUID);

  // const simplifiedSensorEvents = uniqBy(
  //   flattenDeep(latestSensorEvents)
  //     .map((sensorEvent) => ({
  //       name: SENSOR_MESSAGE.NO_NAME,
  //       gatewayUID: sensorEvent.gatewayUID,
  //       macAddress: sensorEvent.macAddress.split("#")[0],
  //       humidity: sensorEvent?.humidity
  //         ? sensorEvent.humidity
  //         : SENSOR_MESSAGE.NO_HUMIDITY,
  //       pressure: sensorEvent?.pressure
  //         ? sensorEvent.pressure
  //         : SENSOR_MESSAGE.NO_PRESSURE,
  //       temperature: sensorEvent?.temperature
  //         ? sensorEvent.temperature
  //         : SENSOR_MESSAGE.NO_TEMPERATURE,
  //       voltage: sensorEvent?.voltage
  //         ? sensorEvent.voltage
  //         : SENSOR_MESSAGE.NO_VOLTAGE,
  //       lastActivity: sensorEvent.lastActivity,
  //     }))
  //     .filter((addr) => addr !== undefined),
  //   "macAddress"
  // );

  // 3. Get the names of the sensors from the API via config.db
  // const getExtraSensorDetails = async (gatewaySensorInfo: Sensor) => {
  //   const resp = await axios.get(
  //     `${config.appBaseUrl}/api/gateway/${gatewaySensorInfo.gatewayUID}/sensor/${gatewaySensorInfo.macAddress}/config`
  //   );

  //   const sensorNameInfo = resp.data as NotehubSensorConfig;

  //   // 4. Put tt all together
  //   return {
  //     macAddress: gatewaySensorInfo.macAddress,
  //     gatewayUID: gatewaySensorInfo.gatewayUID,
  //     name: sensorNameInfo.body.name,
  //     voltage: gatewaySensorInfo.voltage,
  //     lastActivity: gatewaySensorInfo.lastActivity,
  //     humidity: gatewaySensorInfo.humidity,
  //     pressure: gatewaySensorInfo.pressure,
  //     temperature: gatewaySensorInfo.temperature,
  //   };
  // };

  // const getAllSensorData = async (gatewaySensorInfo: Sensor[]) =>
  //   Promise.all(gatewaySensorInfo.map(getExtraSensorDetails));

  // const allLatestSensorData = await getAllSensorData(simplifiedSensorEvents);

  // return {allLatestSensorData, historicalSensorData};
  return { latestSensorData };
}
