import SensorReading from "./SensorReading";
import VoltageSensorSchema from "./VoltageSensorSchema";

class VoltageSensorReading implements SensorReading<number> {
  schema: VoltageSensorSchema;

  value: number;

  captured: string;

  constructor(options: { value: number; captured: string }) {
    this.schema = VoltageSensorSchema;
    this.value = options.value;
    this.captured = options.captured;
  }
}

export default VoltageSensorReading;
