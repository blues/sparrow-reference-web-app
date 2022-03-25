
import { formatDistanceToNow, sub } from "date-fns";
import { sortBy, uniqBy } from "lodash";
import { Gateway, SensorTypeCurrentReading } from "../../services/AppModel";
import Reading from "../models/readings/Reading";
import ReadingSchema from "../models/readings/ReadingSchema";

// eslint-disable-next-line import/prefer-default-export
export const getFormattedLastSeen = (date: string) =>
  getFormattedLastSeenDate(new Date(date));

export const getFormattedLastSeenDate = (date: Date) =>
  formatDistanceToNow(date, {
    addSuffix: true,
  });


export const getFormattedChartData = (
  readings: Reading<unknown>[],
  readingSchema: ReadingSchema<unknown>
) => {
  if (readings.length) {
    const formattedData = sortBy(
      uniqBy(
        readings
          .filter((reading) => reading.schema === readingSchema)
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
  if (voltage!==undefined) {
    const formattedData = `${voltage.toFixed(2)}V`;
    return formattedData;
  }
  return null;
};

export const getFormattedCountData = (count: number | undefined) => {
  if (count!==undefined) {
    const formattedData = `${count}`;
    return formattedData;
  }
  return null;
};

export const getFormattedTotalData = (total: number | undefined) => {
  if (total!==undefined) {
    const formattedData = `${total}`;
    return formattedData;
  }
  return null;
};

export const getEpochChartDataDate = (minutesToConvert: number) => {
  const date = new Date();
  const rawEpochDate = sub(date, { minutes: minutesToConvert });
  const formattedEpochDate = Math.round(
    rawEpochDate.getTime() / 1000
  ).toString();
  return formattedEpochDate;
};


export function findCurrentReadingWithName(gateway: Gateway, name: SensorTypeCurrentReading["sensorType"]["name"]) : SensorTypeCurrentReading | undefined {
  return gateway.currentReadings?.find((sensorTypeReading) => name===sensorTypeReading.sensorType.name);
}

export function asNumber(value: unknown): number | undefined {
  return typeof value==="number" ? Number(value) : undefined;
}

