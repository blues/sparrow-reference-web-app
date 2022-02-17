import { Card, Col, Row } from "antd";
import Text from "antd/lib/typography/Text";
import SensorDetailViewModel from "../../models/SensorDetailViewModel";
import styles from "../../styles/Home.module.scss";
import detailsStyles from "../../styles/Details.module.scss";
import SensorDetailsChart from "../charts/SensorDetailsChart";
import TemperatureSensorSchema from "../models/readings/TemperatureSensorSchema";
import { HISTORICAL_SENSOR_DATA_MESSAGE } from "../constants/ui";
import HumiditySensorSchema from "../models/readings/HumiditySensorSchema";
import VoltageSensorSchema from "../models/readings/VoltageSensorSchema";
import PressureSensorSchema from "../models/readings/PressureSensorSchema";

type SensorDetailsData = {
  err: string;
  onChangeName: (name: string) => Promise<boolean>;
  viewModel: SensorDetailViewModel;
};

const SensorDetails = ({ err, onChangeName, viewModel }: SensorDetailsData) => (
  <>
    {err && <h2 className={styles.errorMessage}>{err}</h2>}
    {viewModel.sensor && (
      <div>
        <Text type="secondary">Sensor</Text>
        <h2>
          <Text editable={{ onChange: onChangeName }}>
            {viewModel.sensor.name}
          </Text>
        </h2>
        <h3
          data-testid="sensor-gateway-name"
          className={styles.sectionSubHeader}
        >
          Gateway:{` `}
          {viewModel?.gateway?.serialNumber && viewModel.gateway.serialNumber}
        </h3>
        <h3
          data-testid="current-readings"
          className={detailsStyles.tabSectionTitle}
        >
          Current Readings
        </h3>
        <p data-testid="last-seen" className={detailsStyles.timestamp}>
          Last updated {viewModel.sensor.lastActivity}
        </p>
        <Row gutter={[8, 16]}>
          <Col xs={7} sm={6} lg={6}>
            <Card className={detailsStyles.card} data-testid="temperature">
              Temperature
              <br />
              <span className={detailsStyles.dataNumber}>
                {viewModel.sensor.temperature}
              </span>
            </Card>
          </Col>
          <Col xs={5} sm={6} lg={6}>
            <Card className={detailsStyles.card} data-testid="humidity">
              Humidity
              <br />
              <span className={detailsStyles.dataNumber}>
                {viewModel.sensor.humidity}
              </span>
            </Card>
          </Col>
          <Col xs={5} sm={5} lg={6}>
            <Card className={detailsStyles.card} data-testid="voltage">
              Voltage
              <br />
              <span className={detailsStyles.dataNumber}>
                {viewModel.sensor.voltage}
              </span>
            </Card>
          </Col>
          <Col xs={7} sm={7} lg={6}>
            <Card className={detailsStyles.card} data-testid="pressure">
              <li>
                Pressure
                <br />
                <span className={detailsStyles.dataNumber}>
                  {viewModel.sensor.pressure}
                </span>
              </li>
            </Card>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <Card className={detailsStyles.sensorChart}>
              <h3>Temperature</h3>
              <p
                data-testid="last-seen-temperature"
                className={detailsStyles.sensorChartTimestamp}
              >
                Last updated {viewModel.sensor.lastActivity}
              </p>
              {viewModel.readings?.temperature.length ? (
                <SensorDetailsChart
                  label="Temperature"
                  data={viewModel.readings.temperature}
                  chartColor="#59d2ff"
                  schema={TemperatureSensorSchema}
                />
              ) : (
                HISTORICAL_SENSOR_DATA_MESSAGE.NO_TEMPERATURE_HISTORY
              )}
            </Card>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <Card className={detailsStyles.sensorChart}>
              <h3>Humidity</h3>
              <p
                data-testid="last-seen-humidity"
                className={detailsStyles.sensorChartTimestamp}
              >
                Last updated {viewModel.sensor.lastActivity}
              </p>
              {viewModel.readings?.humidity.length ? (
                <SensorDetailsChart
                  label="Humidity"
                  data={viewModel.readings.humidity}
                  chartColor="#ba68c8"
                  schema={HumiditySensorSchema}
                />
              ) : (
                HISTORICAL_SENSOR_DATA_MESSAGE.NO_HUMIDITY_HISTORY
              )}
            </Card>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <Card className={detailsStyles.sensorChart}>
              <h3>Voltage</h3>
              <p
                data-testid="last-seen-voltage"
                className={detailsStyles.sensorChartTimestamp}
              >
                Last updated {viewModel.sensor.lastActivity}
              </p>
              {viewModel.readings?.voltage.length ? (
                <SensorDetailsChart
                  label="Voltage"
                  data={viewModel.readings.voltage}
                  chartColor="#9ccc65"
                  schema={VoltageSensorSchema}
                />
              ) : (
                HISTORICAL_SENSOR_DATA_MESSAGE.NO_VOLTAGE_HISTORY
              )}
            </Card>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <Card className={detailsStyles.sensorChart}>
              <h3>Pressure</h3>
              <p
                data-testid="last-seen-voltage"
                className={detailsStyles.sensorChartTimestamp}
              >
                Last updated {viewModel.sensor.lastActivity}
              </p>
              {viewModel.readings?.pressure.length ? (
                <SensorDetailsChart
                  label="Pressure"
                  data={viewModel.readings.pressure}
                  chartColor="#ffd54f"
                  schema={PressureSensorSchema}
                />
              ) : (
                HISTORICAL_SENSOR_DATA_MESSAGE.NO_PRESSURE_HISTORY
              )}
            </Card>
          </Col>
        </Row>
      </div>
    )}
  </>
);

export default SensorDetails;
