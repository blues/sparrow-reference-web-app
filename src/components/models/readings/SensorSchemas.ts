import HumiditySensorSchema from "./HumiditySensorSchema";
import PressureSensorSchema from "./PressureSensorSchema";
import TemperatureSensorSchema from "./TemperatureSensorSchema";
import VoltageSensorSchema from "./VoltageSensorSchema";

const SensorSchemas = {
  humidity: HumiditySensorSchema,
  pressure: PressureSensorSchema,
  temperature: TemperatureSensorSchema,
  voltage: VoltageSensorSchema,
};

export default SensorSchemas;
