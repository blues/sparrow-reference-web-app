/* eslint-disable react/require-default-props */
import { ChartData, ChartOptions } from "chart.js";
import { CHART_DATE_FORMAT, getTooltipDisplayText } from "./chartHelper";
import type { SensorDetailsChartProps } from "./chartHelper";
import BarChart from "./BarChart";

const SensorDetailsBarChart = ({
  label,
  chartColor,
  data,
  schema,
}: SensorDetailsChartProps) => {
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
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          drag: {
            enabled: true,
          },
          mode: "xy",
        },
        limits: {
          yAxis: { min: 0 },
        },
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
