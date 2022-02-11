import { useRouter } from "next/router";
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
      headStyle={{ padding: "0" }}
      bodyStyle={{ padding: "0" }}
      className={styles.cardStyle}
      hoverable
      onClick={handleCardClick}
      title={
        <>
          <div data-testid={`gateway[${index}]-details`}>
            {gatewayDetails.serialNumber}
          </div>
          <span className={styles.timestamp}>
            Last updated&nbsp;
            {getFormattedLastSeen(gatewayDetails.lastActivity)}
          </span>
          <br />
          <br />
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
