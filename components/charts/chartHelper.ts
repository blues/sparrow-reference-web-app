import {
  Chart as ChartJS,
  ChartOptions,
  CategoryScale,
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
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
);

export const GLOBAL_CHART_OPTIONS: ChartOptions = {
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    }
  }
};

export function getChartOptions(overrides?: ChartOptions): ChartOptions {
  return {
    ...GLOBAL_CHART_OPTIONS,
    ...overrides,
  }
}