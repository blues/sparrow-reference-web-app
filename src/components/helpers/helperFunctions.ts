import { formatDistanceToNow } from "date-fns";
import NotehubEvent from "../../models/NotehubEvent";
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

export const getFormattedTemperatureData = (sensorData: Sensor) => {
  if (sensorData.temperature) {
    const formattedData = `${sensorData.temperature}°C`;
    return formattedData;
  }
  return null;
};

export const getFormattedHumidityData = (sensorData: Sensor) => {
  if (sensorData.humidity) {
    const formattedData = `${sensorData.humidity}%`;
    return formattedData;
  }
  return null;
};

export const getFormattedPressureData = (sensorData: Sensor) => {
  if (sensorData.pressure) {
    const formattedData = `${sensorData.pressure / 1000} kPa`;
    return formattedData;
  }
  return null;
};

export const getFormattedVoltageData = (data: Sensor | Gateway) => {
  if (data.voltage) {
    const formattedData = `${data.voltage}V`;
    return formattedData;
  }
  return null;
};
