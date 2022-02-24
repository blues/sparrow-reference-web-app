import { GetServerSideProps, NextPage } from "next";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import GatewayCard from "../components/elements/GatewayCard";
import { services } from "../services/ServiceLocator";
import Gateway from "../components/models/Gateway";
import Sensor from "../components/models/Sensor";
import { getErrorMessage } from "../constants/ui";
import { ERROR_CODES } from "../services/Errors";
import styles from "../styles/Home.module.scss";

type HomeData = {
  gatewaySensorData: Gateway[];
  err?: string;
};

const Home: NextPage<HomeData> = ({ gatewaySensorData, err }) => (
  <div className={styles.container}>
    {err ? (
      <h2 className={styles.errorMessage}>{err}</h2>
    ) : (
      <>
        <h2 data-testid="gateway-header" className={styles.sectionSubTitle}>
          Gateways
        </h2>
        {/* todo make some custom icons to stop console errors */}
        <Carousel
          dots
          arrows
          nextArrow={<RightOutlined />}
          prevArrow={<LeftOutlined />}
        >
          {gatewaySensorData.map((gateway, index) => (
            <GatewayCard
              key={gateway.uid}
              index={index}
              gatewayDetails={gateway}
            />
          ))}
        </Carousel>
      </>
    )}
  </div>
);
export default Home;

export const getServerSideProps: GetServerSideProps<HomeData> = async () => {
  let gateways: Gateway[] = [];
  let latestSensorDataList: Sensor[] = [];
  const gatewaySensorData: Gateway[] = [];
  try {
    const appService = services().getAppService();
    gateways = await appService.getGateways();
    latestSensorDataList = await appService.getSensors(
      gateways.map((gateway) => gateway.uid)
    );

    const gatewaySensorData = gateways.map((gateway) => {
      const filterSensorsByGateway = latestSensorDataList.filter(
        (sensor) => sensor.gatewayUID === gateway.uid
      );
      const updatedSensorList = {
        sensorList: filterSensorsByGateway,
      };
      const updatedGatewayObject = { ...gateway, ...updatedSensorList };
      return updatedGatewayObject;
    });

    return {
      props: { gatewaySensorData },
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        props: {
          gatewaySensorData,
          err: getErrorMessage(err.message),
        },
      };
    }
    return {
      props: {
        gatewaySensorData,
        err: getErrorMessage(ERROR_CODES.INTERNAL_ERROR),
      },
    };
  }
};
