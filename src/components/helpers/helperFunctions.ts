import { formatDistanceToNow } from "date-fns";
import Sensor from "../models/Sensor";
import Gateway from "../models/Gateway";
import SensorReading from "../models/SensorReading";

// eslint-disable-next-line import/prefer-default-export
export const getFormattedLastSeen = (date: string) =>
  formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });

export const getFormattedChartData = (
  sensorReadings: SensorReading[],
  chartKey: string
) => {
  if (sensorReadings.length) {
    const formattedData = sensorReadings
      .filter((event) => {
        if (event.key === chartKey) {
          return event;
        }
        return false;
      })
      .map((filteredEvents) => {
        const chartDataObj = {
          when: filteredEvents.captured.toString(),
          value: Number(filteredEvents.value),
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
