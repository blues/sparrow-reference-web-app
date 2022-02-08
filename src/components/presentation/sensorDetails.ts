import { SENSOR_MESSAGE } from "../../constants/ui";
import SensorDetailViewModel from "../../models/SensorDetailViewModel";
import {
  getFormattedChartData,
  getFormattedHumidityData,
  getFormattedLastSeen,
  getFormattedPressureData,
  getFormattedTemperatureData,
  getFormattedVoltageData,
} from "./uiHelpers";
import Sensor from "../models/Sensor";
import SensorReading from "../models/readings/SensorReading";
import TemperatureSensorSchema from "../models/readings/TemperatureSensorSchema";
import HumiditySensorSchema from "../models/readings/HumiditySensorSchema";
import PressureSensorSchema from "../models/readings/PressureSensorSchema";
import VoltageSensorSchema from "../models/readings/VoltageSensorSchema";

// eslint-disable-next-line import/prefer-default-export
export function getSensorDetailsPresentation(
  sensor: Sensor,
  readings: SensorReading<unknown>[]
): SensorDetailViewModel {
  return {
    sensor: {
      name: sensor.name || SENSOR_MESSAGE.NO_NAME,
      lastActivity: getFormattedLastSeen(sensor.lastActivity),
      temperature:
        getFormattedTemperatureData(sensor) || SENSOR_MESSAGE.NO_TEMPERATURE,
      humidity: getFormattedHumidityData(sensor) || SENSOR_MESSAGE.NO_HUMIDITY,
      pressure: getFormattedPressureData(sensor) || SENSOR_MESSAGE.NO_PRESSURE,
      voltage: getFormattedVoltageData(sensor) || SENSOR_MESSAGE.NO_VOLTAGE,
    },
    readings: {
      temperature: getFormattedChartData(readings, TemperatureSensorSchema),
      humidity: getFormattedChartData(readings, HumiditySensorSchema),
      pressure: getFormattedChartData(readings, PressureSensorSchema),
      voltage: getFormattedChartData(readings, VoltageSensorSchema),
    },
  };
}
