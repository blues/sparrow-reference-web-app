import Image from "next/image";
import { Col, Card, Row } from "antd";
import EditInPlace from "./EditInPlace";
import NodeCard from "./NodeCard";
import {
  calculateCellSignalStrength,
  calculateWiFiSignalStrength,
} from "../presentation/uiHelpers";
import { ERROR_MESSAGE } from "../../constants/ui";
import GatewayDetailViewModel from "../../models/GatewayDetailViewModel";
import styles from "../../styles/Home.module.scss";
import detailsStyles from "../../styles/Details.module.scss";

type GatewayDetailsData = {
  // eslint-disable-next-line react/require-default-props
  err?: string;
  onChangeName: (name: string) => Promise<boolean>;
  viewModel: GatewayDetailViewModel;
};

const GatewayDetails = ({
  err,
  onChangeName,
  viewModel,
}: GatewayDetailsData) => (
  <>
    {err && <h2 className={styles.errorMessage}>{err}</h2>}

    {viewModel.gateway && (
      <div>
        <h2
          data-testid="gateway-details-header"
          className={`${styles.sectionTitle} ${detailsStyles.editableHeading}`}
        >
          <span>Gateway:</span>
          <EditInPlace
            onChange={onChangeName}
            initialText={viewModel.gateway?.name}
            errorMessage={ERROR_MESSAGE.GATEWAY_NAME_CHANGE_FAILED}
          />
        </h2>

        <div className={styles.container}>
          <div
            data-testid="gateway-last-seen"
            className={detailsStyles.timestamp}
          >
            Last seen {viewModel.gateway.lastActivity}
          </div>
          <div
            data-testid="gateway-signal-strength"
            className={detailsStyles.signalStrength}
          >
            {viewModel.gateway.cellBars ? (
              <Image
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                src={calculateCellSignalStrength(viewModel.gateway.cellBars)}
                width={24}
                height={24}
                alt="Gateway cell signal strength"
              />
            ) : null}
            {viewModel.gateway.wifiBars ? (
              <Image
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                src={calculateWiFiSignalStrength(viewModel.gateway.wifiBars)}
                width={24}
                alt="Gateway Wi Fi signal strength"
              />
            ) : null}
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={12} sm={12} lg={8}>
              <Card className={detailsStyles.card}>
                <div className={detailsStyles.cardTitle}>Location</div>
                <span
                  data-testid="gateway-location"
                  className={detailsStyles.dataNumber}
                >
                  {viewModel.gateway.location}
                </span>
              </Card>
            </Col>
            <Col xs={12} sm={12} lg={8}>
              <Card className={detailsStyles.card}>
                <div className={detailsStyles.cardTitle}>Voltage</div>
                <span className={detailsStyles.dataNumber}>
                  {viewModel.gateway.voltage}
                </span>
              </Card>
            </Col>
          </Row>

          {viewModel.nodes && viewModel.nodes.length > 0 ? (
            <>
              <h3
                data-testid="gateway-node-header"
                className={styles.sectionSubTitle}
              >
                Nodes
              </h3>
              <Row gutter={[16, 16]}>
                {viewModel.nodes.map((node, index) => (
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

export default GatewayDetails;
