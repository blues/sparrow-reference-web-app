import { ChartData, ChartOptions } from "chart.js";
import { CHART_DATE_FORMAT } from "./chartHelper";
import LineChart from "./LineChart";

type SensorDetailsChartProps = {
  label: string;
  yAxisMin: number;
  yAxisMax: number;
  data: {
    when: string;
    value: number;
  }[];
};

const SensorDetailsChart = ({
  data,
  label,
  yAxisMin,
  yAxisMax,
}: SensorDetailsChartProps) => {
  const labels = data.map((obj) => obj.when);
  const values = data.map((obj) => obj.value);

  const chartData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label,
        data: values,
        borderColor: "#416681",
        pointRadius: 5,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    scales: {
      xAxis: {
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
        min: yAxisMin,
        max: yAxisMax,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div style={{ width: "870px" }}>
      <LineChart data={chartData} options={options} />
    </div>
  );
};

export default SensorDetailsChart;
