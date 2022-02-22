import SensorReading from "./SensorReading";
import CountSensorSchema from "./CountSensorSchema";

class CountSensorReading implements SensorReading<number> {
  schema: CountSensorSchema;

  value: number;

  captured: string;

  constructor(options: { value: number; captured: string }) {
    this.schema = CountSensorSchema;
    this.value = options.value;
    this.captured = options.captured;
  }
}

export default CountSensorReading;
