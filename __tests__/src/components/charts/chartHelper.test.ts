import {
  GLOBAL_LINE_CHART_OPTIONS,
  getLineChartOptions,
} from "../../../../src/components/charts/chartHelper";

describe("Chart option handling", () => {
  it("Returns the global options by default", () => {
    const options = getLineChartOptions();
    expect(options?.interaction?.mode).toBe(
      GLOBAL_LINE_CHART_OPTIONS?.interaction?.mode
    );
  });

  it("Allows users to override the defaults", () => {
    const customValue = "y";
    const options = getLineChartOptions({
      interaction: {
        mode: customValue,
      },
    });
    expect(options?.interaction?.mode).toBe(customValue);
  });
});
