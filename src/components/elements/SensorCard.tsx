import Link from "next/link";
import { Card } from "antd";
import Sensor from "../models/Sensor";
import { SENSOR_MESSAGE } from "../../constants/ui";
import {
  getFormattedLastSeen,
  getFormattedTemperatureData,
  getFormattedPressureData,
  getFormattedHumidityData,
  getFormattedVoltageData,
} from "../presentation/uiHelpers";
import styles from "../../styles/Card.module.scss";

interface SensorProps {
  sensorDetails: Sensor;
  index: number;
}

const SensorCardComponent = (props: SensorProps) => {
  // in the future perhaps try to make dynamic items based on model props
  const { sensorDetails, index } = props;
  const formattedTemperatureData = getFormattedTemperatureData(sensorDetails);
  const formattedHumidityData = getFormattedHumidityData(sensorDetails);
  const formattedPressureData = getFormattedPressureData(sensorDetails);
  const formattedVoltageData = getFormattedVoltageData(sensorDetails);

  return (
    <Card
      className={styles.cardStyle}
      title={sensorDetails.name || SENSOR_MESSAGE.NO_NAME}
      extra={
        <Link
          href={`/${sensorDetails.gatewayUID}/sensor/${sensorDetails.macAddress}/details`}
        >
          <a data-testid={`sensor[${index}]-summary`}>&#5171;</a>
        </Link>
      }
    >
      <ul className={styles.cardContents}>
        <li>
          Humidity:&nbsp;
          {formattedHumidityData || SENSOR_MESSAGE.NO_HUMIDITY}
        </li>
        <li>
          Pressure:&nbsp;
          {formattedPressureData || SENSOR_MESSAGE.NO_PRESSURE}
        </li>
        <li>
          Temperature:&nbsp;
          {formattedTemperatureData || SENSOR_MESSAGE.NO_TEMPERATURE}
        </li>
        <li>
          Voltage:&nbsp;
          {formattedVoltageData || SENSOR_MESSAGE.NO_VOLTAGE}
        </li>
        <li>Last seen: {getFormattedLastSeen(sensorDetails.lastActivity)}</li>
      </ul>
    </Card>
  );
};

export default SensorCardComponent;
