import { useRouter } from "next/router";
import { Card, Typography } from "antd";
import Gateway from "../models/Gateway";
import {
  getFormattedLastSeen,
  getFormattedVoltageData,
} from "../presentation/uiHelpers";
import { GATEWAY_MESSAGE } from "../../constants/ui";
import styles from "../../styles/Card.module.scss";

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
    <Card
      headStyle={{ padding: "0", paddingBottom: "14px" }}
      bodyStyle={{ padding: "0" }}
      className={styles.cardStyle}
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
          <span className={styles.timestamp}>
            Last updated{` `}
            {getFormattedLastSeen(gatewayDetails.lastActivity)}
          </span>
        </>
      }
    >
      <ul className={styles.cardContents}>
        <li>
          Location
          <br />
          <span className="dataNumber">{formattedLocation}</span>
        </li>
        <li>
          Voltage
          <br />
          <span className="dataNumber">{formattedGatewayVoltage}</span>
        </li>
      </ul>
    </Card>
  );
};

export default GatewayCardComponent;
