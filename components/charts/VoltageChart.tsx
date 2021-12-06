import { ChartData, ChartOptions } from "chart.js";
import { CHART_DATE_FORMAT } from "./chartHelper";
import LineChart from "./LineChart";

type VoltageChartProps = {
  data: {
    when: Date,
    value: number,
  }[]
}

const VoltageChart = (props: VoltageChartProps) => {
  const labels = props.data.map((obj) => obj.when);
  const values = props.data.map((obj) => obj.value);

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Voltage",
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
          }
        }
      },
      yAxis: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        }
      }
    }
  }

  return <LineChart data={data} options={options} />
}

export default VoltageChart;
