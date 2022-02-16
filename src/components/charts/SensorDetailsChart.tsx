/* eslint-disable react/require-default-props */
import { ChartData, ChartOptions } from "chart.js";
import HumiditySensorSchema from "../models/readings/HumiditySensorSchema";
import PressureSensorSchema from "../models/readings/PressureSensorSchema";
import SensorReadingSchema from "../models/readings/SensorSchema";
import TemperatureSensorSchema from "../models/readings/TemperatureSensorSchema";
import VoltageSensorSchema from "../models/readings/VoltageSensorSchema";
import {
  getFormattedHumidityData,
  getFormattedPressureData,
  getFormattedTemperatureData,
  getFormattedVoltageData,
} from "../presentation/uiHelpers";
import { CHART_DATE_FORMAT } from "./chartHelper";
import LineChart from "./LineChart";

type SensorDetailsChartProps = {
  label: string;
  chartColor: string;
  data: {
    when: string;
    value: number;
  }[];
  schema: SensorReadingSchema<number>;
};

export function getTooltipDisplayText(
  label: string,
  schema: SensorReadingSchema<number>,
  value: number
) {
  let valueDisplay = "";
  switch (schema) {
    case TemperatureSensorSchema:
      valueDisplay = getFormattedTemperatureData(value) || "";
      break;
    case HumiditySensorSchema:
      valueDisplay = getFormattedHumidityData(value) || "";
      break;
    case VoltageSensorSchema:
      valueDisplay = getFormattedVoltageData(value) || "";
      break;
    case PressureSensorSchema:
      valueDisplay = getFormattedPressureData(value) || "";
      break;
    default:
      // eslint-disable-next-line no-console
      console.error(`Unknown schema ${schema.toString()}`);
  }
  return `${label}: ${valueDisplay}`;
}

const SensorDetailsChart = ({
  label,
  chartColor,
  data,
  schema,
}: SensorDetailsChartProps) => {
  const labels = data.map((obj) => obj.when);
  const values = data.map((obj) => obj.value);

  const chartData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: `${chartColor}66`,
        borderColor: `${chartColor}`,
        pointBackgroundColor: `${chartColor}`,
        pointRadius: 2,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    scales: {
      xAxis: {
        grid: {
          display: false,
        },
        type: "time",
        time: {
          displayFormats: {
            millisecond: CHART_DATE_FORMAT,
            second: CHART_DATE_FORMAT,
            minute: CHART_DATE_FORMAT,
            hour: CHART_DATE_FORMAT,
            day: CHART_DATE_FORMAT,
            week: CHART_DATE_FORMAT,
            month: CHART_DATE_FORMAT,
            quarter: CHART_DATE_FORMAT,
            year: CHART_DATE_FORMAT,
          },
        },
      },
      yAxis: {
        grid: {
          drawBorder: false,
        },
        ...(schema === VoltageSensorSchema && { min: 0, max: 5 }),
        ticks: {
          stepSize: 0,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) =>
            getTooltipDisplayText(
              context.dataset.label || "",
              schema,
              context.parsed.y
            ),
        },
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ width: "100%" }}>
      <LineChart data={chartData} options={options} />
    </div>
  );
};

export default SensorDetailsChart;
