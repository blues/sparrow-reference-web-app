import { GetServerSideProps, NextPage } from "next";
import SensorCard from "../components/elements/SensorCard";
import GatewayCard from "../components/elements/GatewayCard";
import { services } from "../services/ServiceLocator";
import Gateway from "../components/models/Gateway";
import Sensor from "../components/models/Sensor";
import styles from "../styles/Home.module.scss";
import { getErrorMessage } from "../constants/ui";

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
    const appService = services().getAppService();
    gateways = await appService.getGateways();
    latestSensorDataList = await appService.getLatestSensorData(gateways);

    return {
      props: { gateways, latestSensorDataList },
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        props: {
          gateways,
          latestSensorDataList,
          err: getErrorMessage(err.message),
        },
      };
    }
    return { props: { gateways, latestSensorDataList } };
  }
};
