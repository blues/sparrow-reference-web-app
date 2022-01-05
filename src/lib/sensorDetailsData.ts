import axios from "axios";
import { uniqBy } from "lodash";
import NotehubLatestEvents from "../models/NotehubLatestEvents";
import NotehubEvent from "../models/NotehubEvent";
import config from "../../config";
import NotehubSensorConfig from "../models/NotehubSensorConfig";
import { SENSOR_MESSAGE } from "../constants/ui";

export default async function getSensorDetailsData(
  gatewayUID: string,
  sensorUID: string
) {
  // Get all latest sensor data from API
  const getLatestSensorData = async () => {
    const resp = await axios.get(
      `${config.appBaseUrl}/api/gateway/${gatewayUID}/sensors`
    );

    const latestSensorEvents = resp.data as NotehubLatestEvents;

    // filter out all latest_events that do not match sensorUID
    const filteredSensorData = latestSensorEvents.latest_events.filter(
      (event: NotehubEvent) => {
        if (event.file.includes(`${sensorUID}`)) {
          return event;
        }
        return false;
      }
    );

    // get sensor name detail from config.db file
    const sensorDetails = await axios.get(
      `${config.appBaseUrl}/api/gateway/${gatewayUID}/sensor/${sensorUID}/config`
    );

    const sensorNameInfo = sensorDetails.data as NotehubSensorConfig;

    // combine the sensor data objs into one
    const latestSensorDataObj = uniqBy(
      filteredSensorData.map((event) => ({
        gatewayUID: `${gatewayUID}`,
        macAddress: `${sensorUID}`,
        name: sensorNameInfo?.body?.name
          ? sensorNameInfo.body.name
          : SENSOR_MESSAGE.NO_NAME,
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

  const latestSensorData = await getLatestSensorData();

  // Get historical sensor data from API
  const getHistoricalSensorData = async () => {
    const resp = await axios.get(
      `${config.appBaseUrl}/api/gateway/${gatewayUID}/historicalSensors`
    );

    const sensorEvents = resp.data as NotehubEvent[];
    // filter out all events that do not match sensorUID and gatewayUID
    const filteredHistoricalSensorEvents = sensorEvents.filter(
      (event: NotehubEvent) => {
        if (
          event.file &&
          event.file.includes(`${sensorUID}`) &&
          event.device_uid === gatewayUID
        ) {
          return true;
        }
        return false;
      }
    );

    return filteredHistoricalSensorEvents;
  };

  // Get historical data from API for charts
  const historicalSensorData = await getHistoricalSensorData();

  return { latestSensorData, historicalSensorData };
}
