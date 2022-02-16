import { useRouter } from "next/router";
import { Card, Typography } from "antd";
import Sensor from "../models/Sensor";
import { getSensorDetailsPresentation } from "../presentation/sensorDetails";
import SensorDetailViewModel from "../../models/SensorDetailViewModel";
import styles from "../../styles/Card.module.scss";

interface SensorProps {
  sensorDetails: Sensor;
  index: number;
}

const SensorCardComponent = (props: SensorProps) => {
  const { sensorDetails, index } = props;
  const { Text } = Typography;

  const viewModel: SensorDetailViewModel =
    getSensorDetailsPresentation(sensorDetails);

  const router = useRouter();
  const sensorUrl = `/${sensorDetails.gatewayUID}/sensor/${sensorDetails.macAddress}/details`;
  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push(sensorUrl);
  };

  return (
    <Card
      headStyle={{ padding: "0" }}
      bodyStyle={{ padding: "0" }}
      className={styles.cardStyle}
      onClick={handleCardClick}
      hoverable
      title={
        <>
          <Text
            ellipsis={{
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              tooltip: `${viewModel?.sensor?.name}`,
            }}
            data-testid={`sensor[${index}]-summary`}
          >
            {viewModel?.sensor?.name}
          </Text>
          <span data-testid="sensor-timestamp" className={styles.timestamp}>
            Last updated{` `}
            {viewModel?.sensor?.lastActivity}
          </span>
          <div data-testid="sensor-location" className={styles.locationWrapper}>
            <span className={styles.locationTitle}>Location{` `}</span>
            <span className={styles.location}>
              {viewModel?.sensor?.location}
            </span>
          </div>
        </>
      }
    >
      <ul className={styles.cardContentsSensor}>
        <li>
          Humidity
          <br />
          <span className="dataNumber">{viewModel?.sensor?.humidity}</span>
        </li>
        <li>
          Pressure
          <br />
          <span className="dataNumber">{viewModel?.sensor?.pressure}</span>
        </li>
        <li>
          Temperature
          <br />
          <span className="dataNumber">{viewModel?.sensor?.temperature}</span>
        </li>
        <li>
          Voltage
          <br />
          <span className="dataNumber">{viewModel?.sensor?.voltage}</span>
        </li>
      </ul>
    </Card>
  );
};

export default SensorCardComponent;
