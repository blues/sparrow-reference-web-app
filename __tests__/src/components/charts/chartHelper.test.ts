import {
  GLOBAL_LINE_CHART_OPTIONS,
  getLineChartOptions,
  GLOBAL_BAR_CHART_OPTIONS,
  getBarChartOptions,
} from "../../../../src/components/charts/chartHelper";

describe("Chart options handling", () => {
  it("Returns the line chart options when they're called", () => {
    const options = getLineChartOptions();
    expect(options?.interaction?.mode).toBe(
      GLOBAL_LINE_CHART_OPTIONS?.interaction?.mode
    );
  });

  it("Allows users to override the line chart defaults", () => {
    const customValue = "y";
    const options = getLineChartOptions({
      interaction: {
        mode: customValue,
      },
    });
    expect(options?.interaction?.mode).toBe(customValue);
  });

  it("Returns the bar chart options when they're called", () => {
    const options = getBarChartOptions();
    expect(options?.interaction?.mode).toBe(
      GLOBAL_BAR_CHART_OPTIONS?.interaction?.mode
    );
  });

  it("Allows users to override the bar chart defaults", () => {
    const customValue = "x";
    const options = getBarChartOptions({
      interaction: {
        mode: customValue,
      },
    });
    expect(options?.interaction?.mode).toBe(customValue);
  });
});
