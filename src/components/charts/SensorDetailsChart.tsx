/* eslint-disable react/require-default-props */
import { ChartData, ChartOptions } from "chart.js";
import { CHART_DATE_FORMAT } from "./chartHelper";
import LineChart from "./LineChart";

type SensorDetailsChartProps = {
  label: string;
  yAxisMin?: number;
  yAxisMax?: number;
  chartColor: string;
  data: {
    when: string;
    value: number;
  }[];
  unitDisplay?: string;
};

export function getTooltipDisplayText(
  label: string,
  unitDisplay: string,
  value: number
) {
  return `${label}: ${value.toFixed(2)}${unitDisplay}`;
}

const SensorDetailsChart = ({
  label,
  yAxisMin,
  yAxisMax,
  chartColor,
  data,
  unitDisplay,
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
        ...(typeof yAxisMin === "number" && { min: yAxisMin }),
        ...(typeof yAxisMax === "number" && { max: yAxisMax }),
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
              unitDisplay || "",
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
    <div style={{ width: "395px" }}>
      <LineChart data={chartData} options={options} />
    </div>
  );
};

export default SensorDetailsChart;
