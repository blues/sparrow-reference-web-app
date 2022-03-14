/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { Row, Col, Card } from "antd";
import { getGateway } from "../../api-client/gateway";
import { getNodes } from "../../api-client/node";
import NodeCard from "../../components/elements/NodeCard";
import { LoadingSpinner } from "../../components/layout/LoadingSpinner";
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
import detailsStyles from "../../styles/Details.module.scss";
import styles from "../../styles/Home.module.scss";

interface GatewayDetailsQueryInterface extends ParsedUrlQuery {
  gatewayUID: string;
}

const GatewayDetails: NextPage = () => {
  const [gateway, setGateway] = useState<Gateway>({});
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<string>(GATEWAY_MESSAGE.NO_LOCATION);
  const [voltage, setVoltage] = useState<string | null>(
    GATEWAY_MESSAGE.NO_VOLTAGE
  );
  const [err, setErr] = useState<string>("");

  const { query } = useRouter();

  useEffect(() => {
    const fetchGateways = async () => {
      const { gatewayUID } = query as GatewayDetailsQueryInterface;
      setIsLoading(true);

      try {
        const rawGateway = (await getGateway(gatewayUID)) as Gateway;
        setGateway(rawGateway);
        const rawNodes = (await getNodes(gatewayUID)) as Node[];
        setNodes(rawNodes);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setErr(getErrorMessage(error.message));
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchGateways();
  }, [query]);

  useEffect(() => {
    const formattedLocation =
      gateway && gateway?.location
        ? gateway.location
        : GATEWAY_MESSAGE.NO_LOCATION;
    setLocation(formattedLocation);

    const formattedGatewayVoltage = gateway
      ? getFormattedVoltageData(gateway.voltage)
      : GATEWAY_MESSAGE.NO_VOLTAGE;
    setVoltage(formattedGatewayVoltage);
  }, [gateway, nodes]);

  return (
    <LoadingSpinner isLoading={isLoading}>
      {err && <h2 className={styles.errorMessage}>{err}</h2>}

      {!isEmpty(gateway) && (
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
                    {location}
                  </span>
                </Card>
              </Col>
              <Col xs={12} sm={12} lg={8}>
                <Card className={detailsStyles.card}>
                  <div className={detailsStyles.cardTitle}>Voltage</div>
                  <span className={detailsStyles.dataNumber}>{voltage}</span>
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
    </LoadingSpinner>
  );
};

export default GatewayDetails;
