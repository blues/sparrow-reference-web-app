import {
  GATEWAY_MESSAGE,
  SENSOR_MESSAGE,
  NODE_MESSAGE,
} from "../../constants/ui";
import NodeDetailViewModel from "../../models/NodeDetailViewModel";
import {
  getFormattedChartData,
  getFormattedHumidityData,
  getFormattedLastSeen,
  getFormattedPressureData,
  getFormattedTemperatureData,
  getFormattedVoltageData,
  getFormattedCountData,
  getFormattedTotalData,
} from "./uiHelpers";
import Node from "../models/Node";
import Gateway from "../models/Gateway";
import SensorReading from "../models/readings/SensorReading";
import TemperatureSensorSchema from "../models/readings/TemperatureSensorSchema";
import HumiditySensorSchema from "../models/readings/HumiditySensorSchema";
import PressureSensorSchema from "../models/readings/PressureSensorSchema";
import VoltageSensorSchema from "../models/readings/VoltageSensorSchema";
import CountSensorSchema from "../models/readings/CountSensorSchema";
import TotalSensorSchema from "../models/readings/TotalSensorSchema";

// eslint-disable-next-line import/prefer-default-export
export function getNodeDetailsPresentation(
  node?: Node,
  gateway?: Gateway,
  readings?: SensorReading<unknown>[]
): NodeDetailViewModel {
  return {
    gateway: {
      serialNumber: gateway?.serialNumber || GATEWAY_MESSAGE.NO_SERIAL_NUMBER,
    },
    node: node
      ? {
          name: node.name || NODE_MESSAGE.NO_NAME,
          lastActivity: getFormattedLastSeen(node.lastActivity),
          location: node?.location || NODE_MESSAGE.NO_LOCATION,
          temperature:
            getFormattedTemperatureData(node.temperature) ||
            SENSOR_MESSAGE.NO_TEMPERATURE,
          humidity:
            getFormattedHumidityData(node.humidity) ||
            SENSOR_MESSAGE.NO_HUMIDITY,
          pressure:
            getFormattedPressureData(node.pressure) ||
            SENSOR_MESSAGE.NO_PRESSURE,
          voltage:
            getFormattedVoltageData(node.voltage) || SENSOR_MESSAGE.NO_VOLTAGE,
          count: getFormattedCountData(node.count) || SENSOR_MESSAGE.NO_COUNT,
          total: getFormattedTotalData(node.total) || SENSOR_MESSAGE.NO_TOTAL,
        }
      : undefined,
    readings: readings
      ? {
          temperature: getFormattedChartData(readings, TemperatureSensorSchema),
          humidity: getFormattedChartData(readings, HumiditySensorSchema),
          pressure: getFormattedChartData(readings, PressureSensorSchema),
          voltage: getFormattedChartData(readings, VoltageSensorSchema),
          count: getFormattedChartData(readings, CountSensorSchema),
          total: getFormattedChartData(readings, TotalSensorSchema),
        }
      : undefined,
  };
}
