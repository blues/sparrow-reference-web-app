import { ChartData, Chart, ChartOptions, Filler } from "chart.js";
import { CHART_DATE_FORMAT } from "./chartHelper";
import LineChart from "./LineChart";

type SensorDetailsChartProps = {
  label: string;
  yAxisMin: number;
  yAxisMax: number;
  chartColor: string;
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
  chartColor,
}: SensorDetailsChartProps) => {
  const labels = data.map((obj) => obj.when);
  const values = data.map((obj) => obj.value);
  Chart.register(Filler);

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
        display: false,
      },
      yAxis: {
        min: yAxisMin,
        max: yAxisMax,
        ticks: {
          stepSize: 0,
        },
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
