import React from "react";
import { ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

import { getChartOptions } from "./chartHelper";

type LineChartProps = {
  data: ChartData<"line">,
  options?: ChartOptions,
};

const LineChart = (props: LineChartProps) => {
  const options = getChartOptions(props.options) as ChartOptions<"line">;
  return <Line data={props.data} options={options} />;
}

export default LineChart;
