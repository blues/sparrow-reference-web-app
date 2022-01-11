/* eslint-disable react/jsx-props-no-spreading */
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
  err?: string;
};

const Home: NextPage<HomeData> = ({ gateways, latestSensorDataList, err }) => (
  <div className={styles.container}>
    {err === "Error: Unauthorized to access this project" ? (
      <h2>Sorry, you aren't authorized to view this project data.</h2>
    ) : (
      <>
        <h2>Gateways</h2>
        <div className={styles.groupedCards}>
          {gateways.map((gateway) => (
            <GatewayCard key={gateway.uid} {...gateway} />
          ))}
        </div>

        <h2>Sensors</h2>
        <div className={styles.groupedCards}>
          {latestSensorDataList.map((sensor) => (
            <SensorDetailsCard key={sensor.macAddress} {...sensor} />
          ))}
        </div>
      </>
    )}
  </div>
);

export default Home;

// todo fix this TS error
export const getServerSideProps: GetServerSideProps<HomeData> = async () => {
  try {
    const gateways = await getGateways();
    const latestSensorDataList = await getLatestSensorData(gateways);

    return {
      props: { gateways, latestSensorDataList },
    };
  } catch (err) {
    // console.log("LATEST GATEWAYS ERROR ", err);
    return { props: { err } };
  }
};
