/* eslint-disable react/require-default-props */
import { ChartData, ChartOptions } from "chart.js";
import CountSensorSchema from "../models/readings/CountSensorSchema";
import SensorReadingSchema from "../models/readings/SensorSchema";
import { getFormattedCountData } from "../presentation/uiHelpers";
import { CHART_DATE_FORMAT } from "./chartHelper";
import BarChart from "./BarChart";

type SensorDetailsBarChartProps = {
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
    case CountSensorSchema:
      valueDisplay = getFormattedCountData(value) || "";
      break;
    default:
      // eslint-disable-next-line no-console
      console.error(`Unknown schema ${schema.toString()}`);
  }
  return `${label}: ${valueDisplay}`;
}

const SensorDetailsBarChart = ({
  label,
  chartColor,
  data,
  schema,
}: SensorDetailsBarChartProps) => {
  const labels = data.map((obj) => obj.when);
  const values = data.map((obj) => obj.value);

  const chartData: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: `${chartColor}66`,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
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
        beginAtZero: true,
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
      <BarChart data={chartData} options={options} />
    </div>
  );
};

export default SensorDetailsBarChart;
