import { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

import { getBarChartOptions } from "./chartHelper";

type BarChartProps = {
  data: ChartData<"bar">;
  // eslint-disable-next-line react/require-default-props
  options?: ChartOptions<"bar">;
};

const BarChart = ({ data, options }: BarChartProps) => {
  const mergedOptions = getBarChartOptions(options);
  return <Bar data={data} options={mergedOptions} />;
};

export default BarChart;
