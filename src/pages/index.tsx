import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Card from "../components/elements/Card";
import getGateways from "../lib/gateways";
import getLatestSensorData from "../lib/latestSensorData";
import Gateway from "../models/Gateway";
import Sensor from "../models/Sensor";
import { SENSOR_MESSAGE } from "../constants/ui";
import styles from "../styles/Home.module.scss";

type HomeData = {
  gateways: Gateway[];
  latestSensorDataList: Sensor[];
};

const Home: NextPage<HomeData> = ({ gateways, latestSensorDataList }) => {
  const getFormattedLastSeen = (date: string) =>
    formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });

  return (
    <div className={styles.container}>
      <h2>Gateways</h2>
      <div className={styles.groupedCards}>
        {gateways.map((gateway) => (
          <Card
            key={gateway.uid}
            title={gateway.serialNumber}
            extra={<Link href={`/${gateway.uid}/details`}>Details</Link>}
          >
            <ul>
              <li>Location: {gateway.location}</li>
              <li>Last seen: {getFormattedLastSeen(gateway.lastActivity)}</li>
              <li>Voltage: {gateway.voltage}V</li>
            </ul>
          </Card>
        ))}
      </div>

      <h2>Sensors</h2>
      <div className={styles.groupedCards}>
        {latestSensorDataList.map((sensor) => (
          <Card
            key={sensor.macAddress}
            title={sensor.name ? `${sensor.name}` : SENSOR_MESSAGE.NO_NAME}
            extra={
              <Link
                href={`/${sensor.gatewayUID}/sensor/${sensor.macAddress}/details`}
              >
                Details
              </Link>
            }
          >
            <ul>
              <li>
                Humidity:&nbsp;
                {sensor.humidity
                  ? `${sensor.humidity}%`
                  : SENSOR_MESSAGE.NO_HUMIDITY}
              </li>
              <li>
                Pressure:&nbsp;
                {sensor.pressure
                  ? `${sensor.pressure / 1000} kPa`
                  : SENSOR_MESSAGE.NO_PRESSURE}
              </li>
              <li>
                Temperature:&nbsp;
                {sensor.temperature
                  ? `${sensor.temperature}°C`
                  : SENSOR_MESSAGE.NO_TEMPERATURE}
              </li>
              <li>
                Voltage:&nbsp;
                {sensor.voltage
                  ? `${sensor.voltage}V`
                  : SENSOR_MESSAGE.NO_VOLTAGE}
              </li>
              <li>Last seen: {getFormattedLastSeen(sensor.lastActivity)}</li>
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<HomeData> = async () => {
  const gateways = await getGateways();
  const latestSensorDataList = await getLatestSensorData(gateways);

  return {
    props: { gateways, latestSensorDataList },
  };
};
