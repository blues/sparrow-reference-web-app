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
} from "../helpers/helperFunctions";
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
      headStyle={{ padding: "0" }}
      bodyStyle={{ padding: "0" }}
      className={styles.cardStyle}
      title={
        <>
          <div>
            {sensorDetails.name ? sensorDetails.name : SENSOR_MESSAGE.NO_NAME}
          </div>
          <span className={styles.timestamp}>
            Last seen {getFormattedLastSeen(sensorDetails.lastActivity)}
          </span>
        </>
      }
      extra={
        <Link
          href={`/${sensorDetails.gatewayUID}/sensor/${sensorDetails.macAddress}/details`}
        >
          <a data-testid={`sensor[${index}]-summary`}>Details</a>
        </Link>
      }
    >
      <ul className={styles.cardContents}>
        <li>
          Humidity
          <br />
          <span className="dataNumber">
            {formattedHumidityData || SENSOR_MESSAGE.NO_HUMIDITY}
          </span>
        </li>
        <li>
          Pressure
          <br />
          <span className="dataNumber">
            {formattedPressureData || SENSOR_MESSAGE.NO_PRESSURE}
          </span>
        </li>
        <li>
          Temperature
          <br />
          <span className="dataNumber">
            {formattedTemperatureData || SENSOR_MESSAGE.NO_TEMPERATURE}
          </span>
        </li>
        <li>
          Voltage
          <br />
          <span className="dataNumber">
            {formattedVoltageData || SENSOR_MESSAGE.NO_VOLTAGE}
          </span>
        </li>
      </ul>
    </Card>
  );
};

export default SensorCardComponent;
