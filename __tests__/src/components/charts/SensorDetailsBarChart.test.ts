import { getTooltipDisplayText } from "../../../../src/components/charts/SensorDetailsBarChart";
import CountSensorSchema from "../../../../src/components/models/readings/CountSensorSchema";

describe("Tooltip handling", () => {
  it("Generates correct motion count tooltip text", () => {
    const text = getTooltipDisplayText("Count", CountSensorSchema, 86);
    expect(text).toBe("Count: 86");
  });
});
