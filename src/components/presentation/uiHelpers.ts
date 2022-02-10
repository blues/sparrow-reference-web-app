import { formatDistanceToNow } from "date-fns";
import Sensor from "../models/Sensor";
import Gateway from "../models/Gateway";
import SensorReading from "../models/readings/SensorReading";
import SensorReadingSchema from "../models/readings/SensorSchema";
import PressureSensorSchema from "../models/readings/PressureSensorSchema";

// eslint-disable-next-line import/prefer-default-export
export const getFormattedLastSeen = (date: string) =>
  formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });

export const getFormattedChartData = (
  sensorReadings: SensorReading<unknown>[],
  sensorSchema: SensorReadingSchema<unknown>
) => {
  if (sensorReadings.length) {
    const formattedData = sensorReadings
      .filter((reading) => reading.schema === sensorSchema)
      .map((filteredEvent) => {
        const chartDataObj = {
          when: filteredEvent.captured,
          value:
            // Convert pressure from Pa to kPa
            filteredEvent.schema === PressureSensorSchema
              ? Number(filteredEvent.value) / 1000
              : Number(filteredEvent.value),
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
