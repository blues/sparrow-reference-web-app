import { GetServerSideProps, NextPage } from "next";
import SensorCard from "../components/elements/SensorCard";
import GatewayCard from "../components/elements/GatewayCard";
import { services } from "../services/ServiceLocator";
import Gateway from "../components/models/Gateway";
import Sensor from "../components/models/Sensor";
import styles from "../styles/Home.module.scss";
import { getErrorMessage } from "../constants/ui";
import { ERROR_CODES } from "../services/Errors";

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
        <h2 data-testid="gateway-header" className={styles.sectionSubTitle}>
          Gateways
        </h2>
        <div className={styles.groupedCards}>
          {gateways.map((gateway, index) => (
            <GatewayCard
              key={gateway.uid}
              index={index}
              gatewayDetails={gateway}
            />
          ))}
        </div>

        <h2 data-testid="sensor-header" className={styles.sectionSubTitle}>
          Sensors
        </h2>
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
    latestSensorDataList = await appService.getSensors(
      gateways.map((gateway) => gateway.uid)
    );

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
    return {
      props: {
        gateways,
        latestSensorDataList,
        err: getErrorMessage(ERROR_CODES.INTERNAL_ERROR),
      },
    };
  }
};
