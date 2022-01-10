import Link from "next/link";
import { Card } from "antd";
import Gateway from "../../models/Gateway";
import { getFormattedLastSeen } from "../helpers/helperFunctions";
import styles from "../../styles/Card.module.scss";

const GatewayCardComponent = (props: Gateway) => {
  // in the future perhaps try to make dynamic items based on model props
  const { uid, serialNumber, lastActivity, location, voltage } = props;
  return (
    <Card
      key={uid}
      className={styles.cardStyle}
      title={serialNumber}
      extra={<Link href={`/${uid}/details`}>&#5171;</Link>}
    >
      <ul className={styles.cardContents}>
        <li>Location: {location}</li>
        <li>Last seen: {getFormattedLastSeen(lastActivity)}</li>
        <li>Voltage: {voltage}V</li>
      </ul>
    </Card>
  );
};

export default GatewayCardComponent;
