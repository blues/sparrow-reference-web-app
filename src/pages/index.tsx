import { GetServerSideProps, NextPage } from "next";
import SensorDetailsCard from "../components/elements/SensorDetailsCard";
import GatewayCard from "../components/elements/GatewayCard";
import getGateways from "../lib/gateways";
import getLatestSensorData from "../lib/latestSensorData";
import Gateway from "../models/Gateway";
import Sensor from "../models/Sensor";
import styles from "../styles/Home.module.scss";

type HomeData = {
  gateways: Gateway[];
  latestSensorDataList: Sensor[];
};

const Home: NextPage<HomeData> = ({ gateways, latestSensorDataList }) => (
  <div className={styles.container}>
    <h2>Gateways</h2>
    <div className={styles.groupedCards}>
      {gateways.map((gateway) => (
        // eslint-disable-next-line react/jsx-key
        <GatewayCard {...gateway} />
      ))}
    </div>

    <h2>Sensors</h2>
    <div className={styles.groupedCards}>
      {latestSensorDataList.map((sensor) => (
        // eslint-disable-next-line react/jsx-key
        <SensorDetailsCard {...sensor} />
      ))}
    </div>
  </div>
);

export default Home;

export const getServerSideProps: GetServerSideProps<HomeData> = async () => {
  const gateways = await getGateways();
  const latestSensorDataList = await getLatestSensorData(gateways);

  return {
    props: { gateways, latestSensorDataList },
  };
};
