import { GetServerSideProps, NextPage } from "next";
import SensorCard from "../components/elements/SensorCard";
import GatewayCard from "../components/elements/GatewayCard";
import { services } from "../services/ServiceLocator";
import getLatestSensorData from "../services/latestSensorData";
import Gateway from "../components/models/Gateway";
import Sensor from "../components/models/Sensor";
import styles from "../styles/Home.module.scss";

type HomeData = {
  gateways: Gateway[];
  latestSensorDataList: Sensor[];
  err?: string;
};

const Home: NextPage<HomeData> = ({ gateways, latestSensorDataList, err }) => (
  <div className={styles.container}>
    {err ? (
      <h2 className={styles.errorMessage}>{err}</h2>
    ) : (
      <>
        <h2>Gateways</h2>
        <div className={styles.groupedCards}>
          {gateways.map((gateway, index) => (
            <GatewayCard
              key={gateway.uid}
              index={index}
              gatewayDetails={gateway}
            />
          ))}
        </div>

        <h2>Sensors</h2>
        <div className={styles.groupedCards}>
          {latestSensorDataList.map((sensor, index) => (
            <SensorCard
              key={sensor.macAddress}
              index={index}
              sensorDetails={sensor}
            />
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
    gateways = await services().getAppService().getGateways();
    // todo refactor this in a future story
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
