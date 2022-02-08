/* eslint-disable react/jsx-props-no-spreading */
import type { GetServerSideProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import SensorCard from "../../components/elements/SensorCard";
import { services } from "../../services/ServiceLocator";
import { getFormattedLastSeen } from "../../components/helpers/helperFunctions";
import getLatestSensorData from "../../services/latestSensorData";
import Gateway from "../../components/models/Gateway";
import Sensor from "../../components/models/Sensor";
import styles from "../../styles/Home.module.scss";

type GatewayDetailsData = {
  gateway: Gateway | null;
  sensors: Sensor[];
  err?: string;
};

const GatewayDetails: NextPage<GatewayDetailsData> = ({
  gateway,
  sensors,
  err,
}) => (
  <>
    {err && <h2 className={styles.errorMessage}>{err}</h2>}

    {gateway && (
      <div>
        <h1 data-testid="gateway-details-header">Gateway Details</h1>
        <div className={styles.container}>
          <ul>
            <li data-testid="gateway-name" >Device Name: {gateway.serialNumber}</li>
            {gateway.location && <li data-testid="gateway-location">Location: {gateway.location}</li>}
            <li data-testid="gateway-last-seen">Last Seen: {getFormattedLastSeen(gateway.lastActivity)}</li>
          </ul>

          {sensors?.length > 0 && (
            <>
              <h2 data-testid="gateway-sensor-header">Sensors</h2>
              <div className={styles.groupedCards}>
                {sensors.map((sensor, index) => (
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
      </div>
    )}
  </>
);

export default GatewayDetails;

interface GatewayDetailsQueryInterface extends ParsedUrlQuery {
  gatewayUID: string;
}

export const getServerSideProps: GetServerSideProps<GatewayDetailsData> =
  async ({ query }) => {
    const { gatewayUID } = query as GatewayDetailsQueryInterface;
    let gateway: Gateway | null = null;
    let sensors: Sensor[] = [];
    try {
      gateway = await services().getAppService().getGateway(gatewayUID);
      sensors = await getLatestSensorData([gateway]);

      return {
        props: { gateway, sensors },
      };
    } catch (err) {
      if (err instanceof Error) {
        return { props: { gateway, sensors, err: err.message } };
      }
      return { props: { gateway, sensors } };
    }
  };
