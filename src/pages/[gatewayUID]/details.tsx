/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
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
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<string>(GATEWAY_MESSAGE.NO_LOCATION);
  const [voltage, setVoltage] = useState<string | null>(
    GATEWAY_MESSAGE.NO_VOLTAGE
  );
  const [err, setErr] = useState<string | undefined>(undefined);

  const { query } = useRouter();
  const { gatewayUID } = query as GatewayDetailsQueryInterface;

  const {
    isLoading: gatewayLoading,
    error: gatewayErr,
    data: gateway,
  } = useQuery<Gateway, Error>("getGateway", () => getGateway(gatewayUID), {
    refetchInterval: 30000,
    enabled: !!gatewayUID,
  });

  const {
    isLoading: nodesLoading,
    error: nodeErr,
    data: nodes,
  } = useQuery<unknown, Error>("getNodes", () => getNodes(gatewayUID), {
    enabled: !!gatewayUID,
  });

  useEffect(() => {
    if (gatewayErr) {
      setErr(getErrorMessage(gatewayErr.message));
    }
    if (nodeErr) {
      setErr(getErrorMessage(nodeErr.message));
    }
    if (!nodeErr && !gatewayErr) {
      setErr(undefined);
    }
  }, [gatewayErr, nodeErr]);

  useEffect(() => {
    if (gatewayLoading) {
      setIsLoading(true);
    }
    if (nodesLoading) {
      setIsLoading(true);
    }
    if (!gatewayLoading && !nodesLoading) {
      setIsLoading(false);
    }
  }, [gatewayLoading, nodesLoading]);

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

            {nodes ? (
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
