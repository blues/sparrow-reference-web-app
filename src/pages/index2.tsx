import { useEffect, useRef } from "react";
import { GetServerSideProps, NextPage } from "next";
import { Carousel } from "antd";
import { CarouselRef } from "antd/lib/carousel";
import GatewayCard from "../components/elements/FlexibleGatewayCard";
import { services } from "../services/ServiceLocator";
import GatewayDEPRECATED from "../components/models/Gateway";
import Node from "../components/models/Node";
import { getErrorMessage } from "../constants/ui";
import { ERROR_CODES, isError, MayError } from "../services/Errors";
import CarouselArrowFixRight from "../components/elements/CarouselArrowFixRight";
import CarouselArrowFixLeft from "../components/elements/CarouselArrowFixLeft";
import { getCombinedGatewayNodeInfo } from "../components/presentation/gatewayNodeInfo";
import styles from "../styles/Home.module.scss";
import { Project } from "../services/AppModel";

type HomeData = MayError<{
  project: Project
}, string>;

const Home: NextPage<HomeData> = (homeData: HomeData) => {
  const carouselRef = useRef<CarouselRef>(null);
  let body;
  if (isError(homeData)) {
    const err = homeData.err;
    body = <h2 className={styles.errorMessage}>{err}</h2>;
  }
  else {
    const { project } = homeData;
    const gateways = project.gateways;
    body = 
    <>
      <h2 data-testid="gateway-header" className={styles.sectionSubTitle}>
        Gateway
      </h2>
        {gateways && gateways.map(( gateway, index) => (
          <GatewayCard
            key={gateway.id.gatewayDeviceUID}
            index={index}
            gateway={gateway}
          />
        ))}
    </>
  }
  
  useEffect(() => {
    // auto focuses the carousel on component mount for keyboard accessibility
    carouselRef.current?.goTo(0);
  }, []);

  return (
    <div className={styles.container}>
      {body}
    </div>
  );
};
export default Home;

export const getServerSideProps: GetServerSideProps<HomeData> = async () => {
  try {

    const appService = services().getAppService();    
    const project = await appService.getLatestProjectReadings();
    console.log(project);

    console.log(JSON.stringify(project));
    return {
      props: { project },
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        props: {
          err: getErrorMessage(err.message),
        },
      };
    }
    return {
      props: {
        err: getErrorMessage(ERROR_CODES.INTERNAL_ERROR),
      },
    };
  }
};
