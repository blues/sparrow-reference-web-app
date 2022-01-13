/* eslint-disable react/jsx-props-no-spreading */
import { GetServerSideProps, NextPage } from "next";
import SensorDetailsCard from "../components/elements/SensorDetailsCard";
import GatewayCard from "../components/elements/GatewayCard";
import { getGateways } from "../lib/gateways";
import getLatestSensorData from "../lib/latestSensorData";
import Gateway from "../models/Gateway";
import Sensor from "../models/Sensor";
import { ERROR_MESSAGE } from "../constants/ui";
import { HTTP_STATUS } from "../constants/http";
import styles from "../styles/Home.module.scss";

type HomeData = {
  gateways: Gateway[];
  latestSensorDataList: Sensor[];
  err?: string;
};

const Home: NextPage<HomeData> = ({ gateways, latestSensorDataList, err }) => (
  <div className={styles.container}>
    {err === HTTP_STATUS.UNAUTHORIZED ? (
      <h2 className={styles.errorMessage}>{ERROR_MESSAGE.UNAUTHORIZED}</h2>
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

export const getServerSideProps: GetServerSideProps<HomeData> = async () => {
  let gateways: Gateway[] = [];
  let latestSensorDataList: Sensor[] = [];
  try {
    gateways = await getGateways();
    latestSensorDataList = await getLatestSensorData(gateways);

    return {
      props: { gateways, latestSensorDataList },
    };
  } catch (err) {
    if (err instanceof Error) {
      return { props: { gateways, latestSensorDataList, err: err.message } };
    }
    return { props: { gateways, latestSensorDataList } };
  }
};
