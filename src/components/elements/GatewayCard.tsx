import Link from "next/link";
import { Card } from "antd";
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
  // in the future perhaps try to make dynamic items based on model props
  const { gatewayDetails, index } = props;
  const formattedGatewayVoltage = getFormattedVoltageData(gatewayDetails);

  return (
    <Card
      className={styles.cardStyle}
      title={gatewayDetails.serialNumber}
      extra={
        <Link href={`/${gatewayDetails.uid}/details`}>
          <a data-testid={`gateway[${index}]-details`}>&#5171;</a>
        </Link>
      }
    >
      <ul className={styles.cardContents}>
        <li>
          Location:&nbsp;
          {gatewayDetails.location || GATEWAY_MESSAGE.NO_LOCATION}
        </li>
        <li>
          Last seen:&nbsp;{getFormattedLastSeen(gatewayDetails.lastActivity)}
        </li>
        <li>Voltage:&nbsp;{formattedGatewayVoltage}</li>
      </ul>
    </Card>
  );
};

export default GatewayCardComponent;
