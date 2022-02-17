import { GATEWAY_MESSAGE, SENSOR_MESSAGE } from "../../constants/ui";
import SensorDetailViewModel from "../../models/SensorDetailViewModel";
import {
  getFormattedChartData,
  getFormattedHumidityData,
  getFormattedLastSeen,
  getFormattedPressureData,
  getFormattedTemperatureData,
  getFormattedVoltageData,
  getFormattedCountData
} from "./uiHelpers";
import Sensor from "../models/Sensor";
import Gateway from "../models/Gateway";
import SensorReading from "../models/readings/SensorReading";
import TemperatureSensorSchema from "../models/readings/TemperatureSensorSchema";
import HumiditySensorSchema from "../models/readings/HumiditySensorSchema";
import PressureSensorSchema from "../models/readings/PressureSensorSchema";
import VoltageSensorSchema from "../models/readings/VoltageSensorSchema";
import CountSensorSchema from "../models/readings/CountSensorSchema";

// eslint-disable-next-line import/prefer-default-export
export function getSensorDetailsPresentation(
  sensor?: Sensor,
  gateway?: Gateway,
  readings?: SensorReading<unknown>[]
): SensorDetailViewModel {
  return {
    gateway: {
      serialNumber: gateway?.serialNumber || GATEWAY_MESSAGE.NO_SERIAL_NUMBER,
    },
    sensor: sensor
      ? {
          name: sensor.name || SENSOR_MESSAGE.NO_NAME,
          lastActivity: getFormattedLastSeen(sensor.lastActivity),
          location: sensor?.location || SENSOR_MESSAGE.NO_LOCATION,
          temperature:
            getFormattedTemperatureData(sensor.temperature) ||
            SENSOR_MESSAGE.NO_TEMPERATURE,
          humidity:
            getFormattedHumidityData(sensor.humidity) ||
            SENSOR_MESSAGE.NO_HUMIDITY,
          pressure:
            getFormattedPressureData(sensor.pressure) ||
            SENSOR_MESSAGE.NO_PRESSURE,
          voltage:
            getFormattedVoltageData(sensor.voltage) ||
            SENSOR_MESSAGE.NO_VOLTAGE,
          count:
            getFormattedCountData(sensor.count) ||
            SENSOR_MESSAGE.NO_COUNT,
        }
      : undefined,
    readings: readings
      ? {
          temperature: getFormattedChartData(readings, TemperatureSensorSchema),
          humidity: getFormattedChartData(readings, HumiditySensorSchema),
          pressure: getFormattedChartData(readings, PressureSensorSchema),
          voltage: getFormattedChartData(readings, VoltageSensorSchema),
          count: getFormattedChartData(readings, CountSensorSchema)
        }
      : undefined,
  };
}
