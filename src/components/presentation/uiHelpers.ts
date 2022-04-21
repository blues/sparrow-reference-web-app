/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { formatDistanceToNow, sub } from "date-fns";
import { sortBy, uniqBy } from "lodash";
import { Gateway, SensorTypeCurrentReading } from "../../services/AppModel";
import Reading from "../models/readings/Reading";
import ReadingSchema from "../models/readings/ReadingSchema";
import WifiOff from "../elements/signal-strength-images/wi-fi/wifi-off.svg";
import WifiOne from "../elements/signal-strength-images/wi-fi/wifi-one-bar.svg";
import WifiTwo from "../elements/signal-strength-images/wi-fi/wifi-two-bars.svg";
import WifiThree from "../elements/signal-strength-images/wi-fi/wifi-three-bars.svg";
import WifiFull from "../elements/signal-strength-images/wi-fi/wifi-full.svg";
import CellOff from "../elements/signal-strength-images/cell/cell-off.svg";
import CellOne from "../elements/signal-strength-images/cell/cell-one-bar.svg";
import CellTwo from "../elements/signal-strength-images/cell/cell-two-bars.svg";
import CellThree from "../elements/signal-strength-images/cell/cell-three-bars.svg";
import CellFull from "../elements/signal-strength-images/cell/cell-full.svg";
import LoraOff from "../elements/signal-strength-images/lora/lora-off.svg";
import LoraOne from "../elements/signal-strength-images/lora/lora-one-bar.svg";
import LoraTwo from "../elements/signal-strength-images/lora/lora-two-bars.svg";
import LoraThree from "../elements/signal-strength-images/lora/lora-three-bars.svg";
import LoraFull from "../elements/signal-strength-images/lora/lora-full.svg";

export const getFormattedLastSeenDate = (date: Date) =>
  formatDistanceToNow(date, {
    addSuffix: true,
  });

// eslint-disable-next-line import/prefer-default-export
export const getFormattedLastSeen = (date: string) =>
  getFormattedLastSeenDate(new Date(date));

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
  if (voltage !== undefined) {
    const formattedData = `${voltage.toFixed(2)}V`;
    return formattedData;
  }
  return null;
};

export const getFormattedCountData = (count: number | undefined) => {
  if (count !== undefined) {
    const formattedData = `${count}`;
    return formattedData;
  }
  return null;
};

export const getFormattedTotalData = (total: number | undefined) => {
  if (total !== undefined) {
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

export const calculateWiFiSignalStrength = (signalBars: string) => {
  if (signalBars === "0") {
    return WifiOff;
  }
  if (signalBars > "4") {
    return WifiFull;
  }
  const signalLookup = {
    "1": WifiOne,
    "2": WifiTwo,
    "3": WifiThree,
    "4": WifiFull,
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return signalLookup[signalBars as keyof typeof signalLookup];
};

export const calculateCellSignalStrength = (signalBars: string) => {
  if (signalBars === "0") {
    return CellOff;
  }
  if (signalBars > "4") {
    return CellFull;
  }
  const signalLookup = {
    "1": CellOne,
    "2": CellTwo,
    "3": CellThree,
    "4": CellFull,
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return signalLookup[signalBars as keyof typeof signalLookup];
};

export const calculateLoraSignalStrength = (signalBars: string) => {
  if (signalBars === "0") {
    return LoraOff;
  }
  if (signalBars > "4") {
    return LoraFull;
  }
  const signalLookup = {
    "1": LoraOne,
    "2": LoraTwo,
    "3": LoraThree,
    "4": LoraFull,
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return signalLookup[signalBars as keyof typeof signalLookup];
};

export function findCurrentReadingWithName(
  gateway: Gateway,
  name: SensorTypeCurrentReading["sensorType"]["name"]
): SensorTypeCurrentReading | undefined {
  return gateway.currentReadings?.find(
    (sensorTypeReading) => name === sensorTypeReading.sensorType.name
  );
}

export function asNumber(value: unknown): number | undefined {
  return typeof value === "number" ? Number(value) : undefined;
}
