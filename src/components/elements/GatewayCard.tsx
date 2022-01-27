import Link from "next/link";
import { Card } from "antd";
import Gateway from "../models/Gateway";
import {
  getFormattedLastSeen,
  getFormattedVoltageData,
} from "../helpers/helperFunctions";
import { GATEWAY_MESSAGE } from "../../constants/ui";
import styles from "../../styles/Card.module.scss";
import SensorDetails from "../../pages/[gatewayUID]/sensor/[sensorUID]/details";

interface GatewayProps {
  gatewayDetails: Gateway;
  index: number;
}

const { Meta } = Card;
const GatewayCardComponent = (props: GatewayProps) => {
  // in the future perhaps try to make dynamic items based on model props
  const { gatewayDetails, index } = props;
  const formattedGatewayVoltage = getFormattedVoltageData(gatewayDetails);

  return (
    <Card
      headStyle={{ padding: "0" }}
      bodyStyle={{ padding: "0" }}
      className={styles.cardStyle}
      title={
        <>
          <div>{gatewayDetails.serialNumber}</div>
          <span className={styles.timestamp}>
            Last seen {getFormattedLastSeen(gatewayDetails.lastActivity)}
          </span>
        </>
      }
      extra={
        <Link href={`/${gatewayDetails.uid}/details`}>
          <a data-testid={`gateway[${index}]-details`}>Details</a>
        </Link>
      }
    >
      <ul className={styles.cardContents}>
        <li>
          Location
          <br />
          <span className="dataNumber">
            {gatewayDetails.location || GATEWAY_MESSAGE.NO_LOCATION}
          </span>
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
