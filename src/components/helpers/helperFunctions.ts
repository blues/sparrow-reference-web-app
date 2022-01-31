import { formatDistanceToNow } from "date-fns";
import NotehubEvent from "../../services/notehub/models/NotehubEvent";
import Sensor from "../models/Sensor";
import Gateway from "../models/Gateway";

// eslint-disable-next-line import/prefer-default-export
export const getFormattedLastSeen = (date: string) =>
  formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });

export const getFormattedChartData = <C extends keyof NotehubEvent["body"]>(
  sensorEvents: NotehubEvent[],
  chartValue: C
) => {
  if (sensorEvents.length) {
    const formattedData = sensorEvents
      .filter((event) => {
        // currently only formatting `air.qo` events because I'm not sure how to display data from `motion.qo` events yet
        if (event.file && event.file.includes("#air.qo")) {
          return event;
        }
        return false;
      })
      .map((filteredEvents) => {
        const chartDataObj = {
          when: filteredEvents.captured,
          value: filteredEvents.body[chartValue],
        };
        return chartDataObj;
      })
      .reverse();
    return formattedData;
  }
  return [];
};

export const getFormattedLocation = (location: string) => {
  const locationCity = location.trim().split(" ").slice(0, -1).join(" ");
  const locationState = location.trim().split(" ").slice(-1)[0];
  const formattedLocation = `${locationCity}, ${locationState}`;
  return formattedLocation;
};

export const getFormattedTemperatureData = (sensorData: Sensor) => {
  if (sensorData.temperature) {
    const formattedData = `${sensorData.temperature.toFixed(2)}°C`;
    return formattedData;
  }
  return null;
};

export const getFormattedHumidityData = (sensorData: Sensor) => {
  if (sensorData.humidity) {
    const formattedData = `${sensorData.humidity.toFixed(2)}%`;
    return formattedData;
  }
  return null;
};

export const getFormattedPressureData = (sensorData: Sensor) => {
  if (sensorData.pressure) {
    const formattedData = `${(sensorData.pressure / 1000).toFixed(2)} kPa`;
    return formattedData;
  }
  return null;
};

export const getFormattedVoltageData = (data: Sensor | Gateway) => {
  if (data.voltage) {
    const formattedData = `${data.voltage.toFixed(2)}V`;
    return formattedData;
  }
  return null;
};
