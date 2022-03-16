import {
  GATEWAY_MESSAGE,
  SENSOR_MESSAGE,
  NODE_MESSSAGE,
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
import Reading from "../models/readings/Reading";
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
  readings?: Reading<unknown>[]
): NodeDetailViewModel {
  const tempReadings = getFormattedChartData(
    readings || [],
    TemperatureSensorSchema
  );
  tempReadings.push({
    when: "2022-03-16T14:34:09Z",
    value: Math.random() * 20,
  });
  return {
    gateway: {
      name: gateway?.name || GATEWAY_MESSAGE.NO_NAME,
    },
    node: node
      ? {
          name: node.name || NODE_MESSSAGE.NO_NAME,
          lastActivity: getFormattedLastSeen(node.lastActivity),
          location: node?.location || NODE_MESSSAGE.NO_LOCATION,
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
          count: `${Math.random()}` || SENSOR_MESSAGE.NO_COUNT,
          total: getFormattedTotalData(node.total) || SENSOR_MESSAGE.NO_TOTAL,
        }
      : undefined,
    readings: readings
      ? {
          temperature: tempReadings,
          humidity: getFormattedChartData(readings, HumiditySensorSchema),
          pressure: getFormattedChartData(readings, PressureSensorSchema),
          voltage: getFormattedChartData(readings, VoltageSensorSchema),
          count: getFormattedChartData(readings, CountSensorSchema),
          total: getFormattedChartData(readings, TotalSensorSchema),
        }
      : undefined,
  };
}
