import {
  Chart as ChartJS,
  ChartOptions,
  CategoryScale,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

// See https://date-fns.org/v2.27.0/docs/format
export const CHART_DATE_FORMAT = "MMM do hh:mm";

export const GLOBAL_CHART_OPTIONS: ChartOptions<"line"> = {
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
};

export function getChartOptions(
  overrides?: ChartOptions<"line">
): ChartOptions<"line"> {
  return {
    ...GLOBAL_CHART_OPTIONS,
    ...overrides,
  };
}
