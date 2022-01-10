import Link from "next/link";
import { Card } from "antd";
import Sensor from "../../models/Sensor";
import { SENSOR_MESSAGE } from "../../constants/ui";
import { getFormattedLastSeen } from "../helpers/helperFunctions";
import styles from "../../styles/Card.module.scss";

const SensorDetailsCardComponent = (props: Sensor) => {
  // in the future perhaps try to make dynamic items based on model props
  const {
    name,
    gatewayUID,
    macAddress,
    humidity,
    pressure,
    temperature,
    voltage,
    lastActivity,
  } = props;
  return (
    <Card
      className={styles.cardStyle}
      key={macAddress}
      title={name ? `${name}` : SENSOR_MESSAGE.NO_NAME}
      extra={
        <Link href={`/${gatewayUID}/sensor/${macAddress}/details`}>
          &#5171;
        </Link>
      }
    >
      <ul className={styles.cardContents}>
        <li>
          Humidity:&nbsp;
          {humidity ? `${humidity}%` : SENSOR_MESSAGE.NO_HUMIDITY}
        </li>
        <li>
          Pressure:&nbsp;
          {pressure ? `${pressure / 1000} kPa` : SENSOR_MESSAGE.NO_PRESSURE}
        </li>
        <li>
          Temperature:&nbsp;
          {temperature ? `${temperature}°C` : SENSOR_MESSAGE.NO_TEMPERATURE}
        </li>
        <li>
          Voltage:&nbsp;
          {voltage ? `${voltage}V` : SENSOR_MESSAGE.NO_VOLTAGE}
        </li>
        <li>Last seen: {getFormattedLastSeen(lastActivity)}</li>
      </ul>
    </Card>
  );
};

export default SensorDetailsCardComponent;
