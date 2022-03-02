import { useRouter } from "next/router";
import { Card, Col, Row, Typography } from "antd";
import Gateway from "../models/Gateway";
import NodeCard from "./NodeCard";
import {
  getFormattedLastSeen,
  getFormattedVoltageData,
} from "../presentation/uiHelpers";
import { GATEWAY_MESSAGE, ERROR_MESSAGE } from "../../constants/ui";
import styles from "../../styles/Home.module.scss";
import cardStyles from "../../styles/Card.module.scss";

interface GatewayProps {
  gatewayDetails: Gateway;
  index: number;
}

const GatewayCardComponent = (props: GatewayProps) => {
  const { gatewayDetails, index } = props;
  const { Text } = Typography;
  const formattedGatewayVoltage = getFormattedVoltageData(
    gatewayDetails.voltage
  );

  const router = useRouter();
  const gatewayUrl = `/${gatewayDetails.uid}/details`;
  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push(gatewayUrl);
  };

  const formattedLocation = gatewayDetails?.location
    ? gatewayDetails.location
    : GATEWAY_MESSAGE.NO_LOCATION;

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} lg={12}>
          <Card
            headStyle={{ padding: "0" }}
            bodyStyle={{ padding: "0" }}
            className={cardStyles.cardStyle}
            hoverable
            onClick={handleCardClick}
            title={
              <>
                <Text
                  ellipsis={{
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    tooltip: `${gatewayDetails.serialNumber}`,
                  }}
                  data-testid={`gateway[${index}]-details`}
                >
                  {gatewayDetails.serialNumber}
                </Text>
                <span className={cardStyles.timestamp}>
                  Last updated{` `}
                  {getFormattedLastSeen(gatewayDetails.lastActivity)}
                </span>
                <div
                  data-testid="gateway-location"
                  className={cardStyles.locationWrapper}
                >
                  <span className={cardStyles.locationTitle}>
                    Location{` `}
                  </span>
                  <span className={cardStyles.location}>
                    {formattedLocation}
                  </span>
                </div>
              </>
            }
          >
            <Row
              justify="start"
              gutter={[16, 16]}
              className={cardStyles.cardContents}
            >
              <Col span={8}>
                Voltage
                <br />
                <span className="dataNumber">{formattedGatewayVoltage}</span>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <h2 data-testid="node-header" className={styles.sectionSubTitle}>
        Nodes
      </h2>
      {gatewayDetails.nodeList.length ? (
        <Row gutter={[16, 16]}>
          {gatewayDetails.nodeList.map((node, cardIndex) => (
            <Col xs={24} sm={24} lg={12} key={node.nodeId}>
              <NodeCard index={cardIndex} nodeDetails={node} />
            </Col>
          ))}
        </Row>
      ) : (
        <h4 className={styles.errorMessage}>{ERROR_MESSAGE.NODES_NOT_FOUND}</h4>
      )}
    </>
  );
};

export default GatewayCardComponent;
