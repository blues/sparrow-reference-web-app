
// this attempts to render readings based on their intrinsic data

import { Reading, SensorType, SensorTypeCurrentReading } from "../../services/AppModel";
import * as Renderer from "../renderers/renderers";

interface TextReadingRenderProps {
  sensorType: SensorType;
  reading: Reading | null;
  noValuePlaceholder?: string;
  fixedPointPrecision?: number;
}

// todo - just a short circuit for now
function formatReadingValue(sensorType: SensorType, fixedPointPrecision: number, value: number) {
  return `${Number.isInteger(value)?value:value.toFixed(fixedPointPrecision)}${sensorType.unitSymbol}`;
}

export function formatReadingRenderProps(props: TextReadingRenderProps): string {
  const fixedPointPrecision = props.fixedPointPrecision===undefined ? 2 : props.fixedPointPrecision;
  const noValuePlaceholder = props.noValuePlaceholder===undefined ? '-' : props.noValuePlaceholder;
  const value = props.reading?.numericValue!=null ? formatReadingValue(props.sensorType, fixedPointPrecision, props.reading.numericValue) : noValuePlaceholder;
  return value;
}

const TextReadingRendererComponent = (props: Renderer.RenderSensorReadingProps) => {
    const value = formatReadingRenderProps(props);
   
    const render = (
      <>
      <span className="sensorTypeName">{props.sensorType.displayMeasure}</span>
      <br />
      <span className="dataNumber">{value}</span>
      </>
    );
    return render;
}

export default TextReadingRendererComponent;