/* eslint-disable react/jsx-props-no-spreading */
import type { GetServerSideProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { Row, Col, Card } from "antd";
import SensorCard from "../../components/elements/SensorCard";
import { services } from "../../services/ServiceLocator";
import Gateway from "../../components/models/Gateway";
import Sensor from "../../components/models/Sensor";
import {
  getFormattedLastSeen,
  getFormattedLocation,
  getFormattedVoltageData,
} from "../../components/helpers/helperFunctions";
import { GATEWAY_MESSAGE } from "../../constants/ui";
import styles from "../../styles/Home.module.scss";
import cardStyles from "../../styles/Card.module.scss";
import detailsStyles from "../../styles/Details.module.scss";

type GatewayDetailsData = {
  gateway: Gateway | null;
  sensors: Sensor[];
  err?: string;
};

const GatewayDetails: NextPage<GatewayDetailsData> = ({
  gateway,
  sensors,
  err,
}) => {
  let formattedLocation = "";

  if (gateway && gateway.location) {
    formattedLocation = getFormattedLocation(gateway.location);
  } else {
    formattedLocation = GATEWAY_MESSAGE.NO_LOCATION;
  }

  const formattedGatewayVoltage = getFormattedVoltageData(gateway);

  return (
    <>
      {err && <h2 className={styles.errorMessage}>{err}</h2>}

      {gateway && (
        <div>
          <h1 className={styles.sectionTitle}>
            Gateway: {gateway.serialNumber}
          </h1>
          <div className={styles.container}>
            <div className={detailsStyles.timestamp}>
              Last seen {getFormattedLastSeen(gateway.lastActivity)}
            </div>

            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Card>
                  Location
                  <br />
                  <span className={detailsStyles.dataNumber}>
                    {formattedLocation}
                  </span>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  Voltage
                  <br />
                  <span className={detailsStyles.dataNumber}>
                    {formattedGatewayVoltage || GATEWAY_MESSAGE.NO_VOLTAGE}
                  </span>
                </Card>
              </Col>
            </Row>

            {sensors?.length > 0 && (
              <>
                <h3 className={styles.sectionSubTitle}>Sensors</h3>
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
};

export default GatewayDetails;

interface GatewayDetailsQueryInterface extends ParsedUrlQuery {
  gatewayUID: string;
}

export const getServerSideProps: GetServerSideProps<
  GatewayDetailsData
> = async ({ query }) => {
  const { gatewayUID } = query as GatewayDetailsQueryInterface;
  let gateway: Gateway | null = null;
  let sensors: Sensor[] = [];
  try {
    const appService = services().getAppService();
    gateway = await appService.getGateway(gatewayUID);
    sensors = await appService.getLatestSensorData([gateway]);

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
