import SensorReading from "./SensorReading";
import PressureSensorSchema from "./PressureSensorSchema";

class PressureSensorReading implements SensorReading<number> {
  schema: PressureSensorSchema;

  value: number;

  captured: string;

  constructor(options: { value: number; captured: string }) {
    this.schema = PressureSensorSchema;
    this.value = options.value;
    this.captured = options.captured;
  }
}

export default PressureSensorReading;
