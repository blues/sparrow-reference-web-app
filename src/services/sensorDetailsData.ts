import axios from "axios";
import { uniqBy } from "lodash";
import NotehubLatestEvents from "./notehub/models/NotehubLatestEvents";
import NotehubEvent from "./notehub/models/NotehubEvent";
import config from "../../config";
import NotehubSensorConfig from "./notehub/models/NotehubSensorConfig";
import { SENSOR_MESSAGE } from "../constants/ui";

//todo refactor in future story
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
      filteredSensorData.map((event: NotehubEvent) => ({
        gatewayUID: `${gatewayUID}`,
        macAddress: `${sensorUID}`,
        name: sensorNameInfo?.body?.name
          ? sensorNameInfo.body.name
          : SENSOR_MESSAGE.NO_NAME,
        ...(event.body?.humidity && { humidity: event.body.humidity }),
        ...(event.body?.pressure && { pressure: event.body.pressure }),
        ...(event.body?.temperature && { temperature: event.body.temperature }),
        ...(event.body?.voltage && { voltage: event.body.voltage }),
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
      `${config.appBaseUrl}/api/gateway/${gatewayUID}/historical-sensors`
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
