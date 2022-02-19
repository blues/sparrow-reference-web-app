import { useRouter } from "next/router";
import { Card, Row, Col, Typography } from "antd";
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
      <Row
        justify="start"
        gutter={[16, 16]}
        className={styles.cardContentsSensor}
      >
        <Col span={8}>
          Humidity
          <br />
          <span className="dataNumber">{viewModel?.sensor?.humidity}</span>
        </Col>
        <Col span={8}>
          Pressure
          <br />
          <span className="dataNumber">{viewModel?.sensor?.pressure}</span>
        </Col>
        <Col span={8}>
          Temperature
          <br />
          <span className="dataNumber">{viewModel?.sensor?.temperature}</span>
        </Col>
        <Col span={8}>
          Voltage
          <br />
          <span className="dataNumber">{viewModel?.sensor?.voltage}</span>
        </Col>
        <Col span={8}>
          Motion
          <br />
          <span className="dataNumber">{viewModel?.sensor?.count}</span>
        </Col>
      </Row>
    </Card>
  );
};

export default SensorCardComponent;
