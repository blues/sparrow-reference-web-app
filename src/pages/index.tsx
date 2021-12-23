import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Card from "../components/elements/Card";
import getGateways from "../lib/gateways";
import getLatestSensorData from "../lib/latestSensorData";
import Gateway from "../models/Gateway";
import Sensor from "../models/Sensor";
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
      {/* todo remove this macAddress from title after names are no longer mocked */}
      <div className={styles.groupedCards}>
        {latestSensorDataList.map((sensor) => (
          <Card
            key={sensor.macAddress}
            title={`${sensor.name}-${sensor.macAddress}`}
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
                {typeof sensor.humidity === "string"
                  ? `${sensor.humidity}`
                  : `${sensor.humidity}%`}
              </li>
              <li>
                Pressure:&nbsp;
                {typeof sensor.pressure === "string"
                  ? `${sensor.pressure}`
                  : `${sensor.pressure / 1000} kPa`}
              </li>
              <li>
                Temperature:&nbsp;
                {typeof sensor.temperature === "string"
                  ? `${sensor.temperature}`
                  : `${sensor.temperature}°C`}
              </li>
              <li>
                Voltage:&nbsp;
                {typeof sensor.voltage === "string"
                  ? `${sensor.voltage}`
                  : `${sensor.voltage}V`}
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
