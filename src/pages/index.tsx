import { useEffect, useRef } from "react";
import { GetServerSideProps, NextPage } from "next";
import { Carousel } from "antd";
import { CarouselRef } from "antd/lib/carousel";
import GatewayCard from "../components/elements/GatewayCard";
import { services } from "../services/ServiceLocator";
import Gateway from "../components/models/Gateway";
import Sensor from "../components/models/Sensor";
import { getErrorMessage } from "../constants/ui";
import { ERROR_CODES } from "../services/Errors";
import CarouselArrowFixRight from "../components/elements/CarouselArrowFixRight";
import CarouselArrowFixLeft from "../components/elements/CarouselArrowFixLeft";
import { getCombinedGatewaySensorInfo } from "../components/presentation/gatewaySensorInfo";
import styles from "../styles/Home.module.scss";

type HomeData = {
  gatewaySensorData: Gateway[];
  err?: string;
};

const Home: NextPage<HomeData> = ({ gatewaySensorData, err }) => {
  const carouselRef = useRef<CarouselRef>(null);

  useEffect(() => {
    // auto focuses the carousel on component mount for keyboard accessibility
    carouselRef.current?.goTo(0);
  }, []);

  return (
    <div className={styles.container}>
      {err ? (
        <h2 className={styles.errorMessage}>{err}</h2>
      ) : (
        <>
          <h2 data-testid="gateway-header" className={styles.sectionSubTitle}>
            Gateway
          </h2>
          <Carousel
            ref={carouselRef}
            focusOnSelect
            dots
            arrows
            nextArrow={<CarouselArrowFixRight />}
            prevArrow={<CarouselArrowFixLeft />}
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
};
export default Home;

export const getServerSideProps: GetServerSideProps<HomeData> = async () => {
  let gateways: Gateway[] = [];
  let latestSensorDataList: Sensor[] = [];
  let gatewaySensorData: Gateway[] = [];
  try {
    const appService = services().getAppService();
    gateways = await appService.getGateways();
    latestSensorDataList = await appService.getSensors(
      gateways.map((gateway) => gateway.uid)
    );

    gatewaySensorData = getCombinedGatewaySensorInfo(
      latestSensorDataList,
      gateways
    );

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
