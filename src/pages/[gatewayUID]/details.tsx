/* eslint-disable react/jsx-props-no-spreading */
import type { GetServerSideProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { Row, Col, Card } from "antd";
import SensorCard from "../../components/elements/SensorCard";
import { services } from "../../services/ServiceLocator";
import {
  getFormattedLastSeen,
  getFormattedVoltageData,
} from "../../components/presentation/uiHelpers";
import Gateway from "../../components/models/Gateway";
import Sensor from "../../components/models/Sensor";
import { GATEWAY_MESSAGE, getErrorMessage } from "../../constants/ui";
import { ERROR_CODES } from "../../services/Errors";
import detailsStyles from "../../styles/Details.module.scss";
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
}) => {
  const formattedLocation =
    gateway && gateway?.location
      ? gateway.location
      : GATEWAY_MESSAGE.NO_LOCATION;
  const formattedGatewayVoltage = gateway
    ? getFormattedVoltageData(gateway)
    : GATEWAY_MESSAGE.NO_VOLTAGE;

  return (
    <>
      {err && <h2 className={styles.errorMessage}>{err}</h2>}

      {gateway && (
        <div>
          <h2
            data-testid="gateway-details-header"
            className={styles.sectionTitle}
          >
            Gateway: {gateway.serialNumber}
          </h2>
          <div className={styles.container}>
            <div
              data-testid="gateway-last-seen"
              className={detailsStyles.timestamp}
            >
              Last seen {getFormattedLastSeen(gateway.lastActivity)}
            </div>

            <Row gutter={[16, 16]}>
              <Col sm={8} lg={6}>
                <Card className={detailsStyles.card}>
                  <div className={detailsStyles.cardTitle}>Location</div>
                  <span
                    data-testid="gateway-location"
                    className={detailsStyles.dataNumber}
                  >
                    {formattedLocation}
                  </span>
                </Card>
              </Col>
              <Col sm={8} lg={6}>
                <Card className={detailsStyles.card}>
                  <div className={detailsStyles.cardTitle}>Voltage</div>
                  <span className={detailsStyles.dataNumber}>
                    {formattedGatewayVoltage}
                  </span>
                </Card>
              </Col>
            </Row>

            {sensors?.length > 0 && (
              <>
                <h3
                  data-testid="gateway-sensor-header"
                  className={styles.sectionSubTitle}
                >
                  Sensors
                </h3>
                <Row>
                  {sensors.map((sensor, index) => (
                    <Col sm={24} lg={12}>
                      <SensorCard
                        key={sensor.macAddress}
                        index={index}
                        sensorDetails={sensor}
                      />
                    </Col>
                  ))}
                </Row>
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

export const getServerSideProps: GetServerSideProps<GatewayDetailsData> =
  async ({ query }) => {
    const { gatewayUID } = query as GatewayDetailsQueryInterface;
    let gateway: Gateway | null = null;
    let sensors: Sensor[] = [];
    try {
      const appService = services().getAppService();
      gateway = await appService.getGateway(gatewayUID);
      sensors = await appService.getSensors([gatewayUID]);

      return {
        props: { gateway, sensors },
      };
    } catch (err) {
      if (err instanceof Error) {
        return {
          props: { gateway, sensors, err: getErrorMessage(err.message) },
        };
      }
      return {
        props: {
          gateway,
          sensors,
          err: getErrorMessage(ERROR_CODES.INTERNAL_ERROR),
        },
      };
    }
  };
