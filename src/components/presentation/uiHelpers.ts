import { formatDistanceToNow } from "date-fns";
import { sortBy, uniqBy } from "lodash";
import SensorReading from "../models/readings/SensorReading";
import SensorReadingSchema from "../models/readings/SensorSchema";

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
    const formattedData = sortBy(
      uniqBy(
        sensorReadings
          .filter((reading) => reading.schema === sensorSchema)
          .map((filteredEvent) => {
            const chartDataObj = {
              when: filteredEvent.captured,
              value: Number(filteredEvent.value),
            };
            return chartDataObj;
          }),
        "when"
      ),
      "when"
    );
    return formattedData;
  }
  return [];
};

export const getFormattedTemperatureData = (
  temperature: number | undefined
) => {
  if (temperature) {
    const formattedData = `${temperature.toFixed(2)}°C`;
    return formattedData;
  }
  return null;
};

export const getFormattedHumidityData = (humidity: number | undefined) => {
  if (humidity) {
    const formattedData = `${humidity.toFixed(2)}%`;
    return formattedData;
  }
  return null;
};

export const getFormattedPressureData = (pressure: number | undefined) => {
  if (pressure) {
    const formattedData = `${pressure.toFixed(2)} kPa`;
    return formattedData;
  }
  return null;
};

export const getFormattedVoltageData = (voltage: number | undefined) => {
  if (voltage) {
    const formattedData = `${voltage.toFixed(2)}V`;
    return formattedData;
  }
  return null;
};

export const getFormattedCountData = (count: number | undefined) => {
  if (count) {
    const formattedData = `${count}`;
    return formattedData;
  }
  return null;
};

export const getFormattedTotalData = (total: number | undefined) => {
  if (total) {
    const formattedData = `${total}`;
    return formattedData;
  }
  return null;
};
