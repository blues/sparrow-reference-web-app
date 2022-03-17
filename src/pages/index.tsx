import { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import { Carousel } from "antd";
import { CarouselRef } from "antd/lib/carousel";
import GatewayCard from "../components/elements/GatewayCard";
import Gateway from "../components/models/Gateway";
import Node from "../components/models/Node";
import { getErrorMessage } from "../constants/ui";
import CarouselArrowFixRight from "../components/elements/CarouselArrowFixRight";
import CarouselArrowFixLeft from "../components/elements/CarouselArrowFixLeft";
import { getCombinedGatewayNodeInfo } from "../components/presentation/gatewayNodeInfo";
import { useGateways } from "../api-client/gateway";
import { getNodes } from "../api-client/node";
import { LoadingSpinner } from "../components/layout/LoadingSpinner";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  const carouselRef = useRef<CarouselRef>(null);
  const [latestNodeDataLoading, setLatestNodeDataLoading] =
    useState<boolean>(false);
  const [gatewayNodeData, setGatewayNodeData] = useState<Gateway[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | undefined>(undefined);
  const refetchInterval = 60000;

  useEffect(() => {
    // auto focuses the carousel on component mount for keyboard accessibility
    carouselRef.current?.goTo(0);
  }, []);

  const {
    isLoading: gatewayLoading,
    error: gatewayError,
    data: gateways,
  } = useGateways(refetchInterval);

  useEffect(() => {
    setLatestNodeDataLoading(true);
    const createGatewayNodeData = async (gatewayList: Gateway[]) => {
      const gatewayUIDs: string[] = gatewayList.map((gateway) => gateway.uid);
      const latestNodeDataList: Node[] = await getNodes(gatewayUIDs);

      const gatewayNodeInfo = getCombinedGatewayNodeInfo(
        latestNodeDataList,
        gatewayList
      );
      setGatewayNodeData(gatewayNodeInfo);
      setLatestNodeDataLoading(false);
    };

    if (gateways) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      createGatewayNodeData(gateways);
    }
  }, [gateways]);

  useEffect(() => {
    if (gatewayLoading) {
      setIsLoading(true);
    }

    if (latestNodeDataLoading) {
      setIsLoading(true);
    }

    if (!gatewayLoading && !latestNodeDataLoading) {
      setIsLoading(false);
    }
  }, [gatewayLoading, latestNodeDataLoading]);

  useEffect(() => {
    if (gatewayError) {
      setErr(getErrorMessage(gatewayError.message));
    }

    if (!gatewayError) {
      setErr(undefined);
    }
  }, [gatewayError]);

  return (
    <LoadingSpinner isLoading={isLoading}>
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
              {gatewayNodeData.length &&
                gatewayNodeData.map((gateway, index) => (
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
    </LoadingSpinner>
  );
};
export default Home;
