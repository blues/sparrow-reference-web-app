import { ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

import { getLineChartOptions } from "./chartHelper";

type LineChartProps = {
  data: ChartData<"line">;
  // eslint-disable-next-line react/require-default-props
  options?: ChartOptions<"line">;
};

const LineChart = ({ data, options }: LineChartProps) => {
  const mergedOptions = getLineChartOptions(options);
  return <Line data={data} options={mergedOptions} />;
};

export default LineChart;
