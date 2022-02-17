import { getTooltipDisplayText } from "../../../../src/components/charts/SensorDetailsLineChart";
import HumiditySensorSchema from "../../../../src/components/models/readings/HumiditySensorSchema";
import PressureSensorSchema from "../../../../src/components/models/readings/PressureSensorSchema";
import TemperatureSensorSchema from "../../../../src/components/models/readings/TemperatureSensorSchema";
import VoltageSensorSchema from "../../../../src/components/models/readings/VoltageSensorSchema";

describe("Tooltip handling", () => {
  it("Generates correct temperature tooltip text", () => {
    const text = getTooltipDisplayText(
      "Temperature",
      TemperatureSensorSchema,
      22.123456
    );
    expect(text).toBe("Temperature: 22.12°C");
  });
  it("Generates correct humidity tooltip text", () => {
    const text = getTooltipDisplayText(
      "Humidity",
      HumiditySensorSchema,
      12.3456789
    );
    expect(text).toBe("Humidity: 12.35%");
  });
  it("Generates correct voltage tooltip text", () => {
    const text = getTooltipDisplayText("Voltage", VoltageSensorSchema, 3.98765);
    expect(text).toBe("Voltage: 3.99V");
  });
  it("Generates correct pressure tooltip text", () => {
    const text = getTooltipDisplayText(
      "Pressure",
      PressureSensorSchema,
      99.999999
    );
    expect(text).toBe("Pressure: 100.00 kPa");
  });
});
