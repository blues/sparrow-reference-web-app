// eslint-disable-next-line import/no-cycle
import SensorReadingSchema from "./SensorSchema";

interface SensorReading<ReadingType> {
  value: ReadingType;
  captured: string;
  schema: SensorReadingSchema<ReadingType>;
}

export default SensorReading;
