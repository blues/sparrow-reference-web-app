/* eslint-disable react/jsx-props-no-spreading */
import type { GetServerSideProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { Row, Col, Card } from "antd";
import NodeCard from "../../components/elements/NodeCard";
import { services } from "../../services/ServiceLocator";
import {
  getFormattedLastSeen,
  getFormattedVoltageData,
} from "../../components/presentation/uiHelpers";
import Gateway from "../../components/models/Gateway";
import Node from "../../components/models/Node";
import {
  GATEWAY_MESSAGE,
  getErrorMessage,
  ERROR_MESSAGE,
} from "../../constants/ui";
import { ERROR_CODES } from "../../services/Errors";
import detailsStyles from "../../styles/Details.module.scss";
import styles from "../../styles/Home.module.scss";

type GatewayDetailsData = {
  gateway: Gateway | null;
  nodes: Node[];
  err?: string;
};

const GatewayDetails: NextPage<GatewayDetailsData> = ({
  gateway,
  nodes,
  err,
}) => {
  const formattedLocation =
    gateway && gateway?.location
      ? gateway.location
      : GATEWAY_MESSAGE.NO_LOCATION;
  const formattedGatewayVoltage = gateway
    ? getFormattedVoltageData(gateway.voltage)
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
              <Col xs={12} sm={12} lg={8}>
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
              <Col xs={12} sm={12} lg={8}>
                <Card className={detailsStyles.card}>
                  <div className={detailsStyles.cardTitle}>Voltage</div>
                  <span className={detailsStyles.dataNumber}>
                    {formattedGatewayVoltage}
                  </span>
                </Card>
              </Col>
            </Row>

            {nodes?.length > 0 ? (
              <>
                <h3
                  data-testid="gateway-node-header"
                  className={styles.sectionSubTitle}
                >
                  Nodes
                </h3>
                <Row gutter={[16, 16]}>
                  {nodes.map((node, index) => (
                    <Col xs={24} sm={24} lg={12} key={node.nodeId}>
                      <NodeCard index={index} nodeDetails={node} />
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              <h4 className={styles.errorMessage}>
                {ERROR_MESSAGE.NODES_NOT_FOUND}
              </h4>
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
  let nodes: Node[] = [];
  try {
    const appService = services().getAppService();
    gateway = await appService.getGateway(gatewayUID);
    nodes = await appService.getNodes([gatewayUID]);

    return {
      props: { gateway, nodes },
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        props: { gateway, nodes, err: getErrorMessage(err.message) },
      };
    }
    return {
      props: {
        gateway,
        nodes,
        err: getErrorMessage(ERROR_CODES.INTERNAL_ERROR),
      },
    };
  }
};
