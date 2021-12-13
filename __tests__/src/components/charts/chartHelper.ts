import {
  GLOBAL_CHART_OPTIONS,
  getChartOptions,
} from "../../../../src/components/charts/chartHelper";

describe("Chart option handling", () => {
  it("Returns the global options by default", () => {
    const options = getChartOptions();
    expect(options.interaction.mode).toBe(
      GLOBAL_CHART_OPTIONS.interaction.mode
    );
  });

  it("Allows users to override the defaults", () => {
    const customValue = "y";
    const options = getChartOptions({
      interaction: {
        mode: customValue,
      },
    });
    expect(options.interaction.mode).toBe(customValue);
  });
});
