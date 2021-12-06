import { ChartData, ChartOptions } from "chart.js";
import LineChart from "./LineChart";

type VoltageChartProps = {
  data: {
    when: Date,
    value: number,
  }[]
}

export default function VoltageChart(props: VoltageChartProps) {
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
            millisecond: "MMM do hh:mm",
            second: "MMM do hh:mm",
            minute: "MMM do hh:mm",
            hour: "MMM do hh:mm",
            day: "MMM do hh:mm",
            week: "MMM do hh:mm",
            month: "MMM do hh:mm",
            quarter: "MMM do hh:mm",
            year: "MMM do hh:mm",
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