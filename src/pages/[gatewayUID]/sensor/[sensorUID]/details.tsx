import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Card, Input, Button, Tabs, Row, Col } from "antd";
import axios from "axios";
import { Store } from "antd/lib/form/interface";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { ParsedUrlQuery } from "querystring";
import Form, { FormProps } from "../../../../components/elements/Form";
import getSensorDetailsData from "../../../../services/sensorDetailsData";
import Sensor from "../../../../components/models/Sensor";
import SensorDetailsChart from "../../../../components/charts/SensorDetailsChart";
import NotehubEvent from "../../../../services/notehub/models/NotehubEvent";
import {
  HISTORICAL_SENSOR_DATA_MESSAGE,
  SENSOR_MESSAGE,
} from "../../../../constants/ui";
import {
  getFormattedChartData,
  getFormattedTemperatureData,
  getFormattedHumidityData,
  getFormattedPressureData,
  getFormattedVoltageData,
  getFormattedLastSeen,
} from "../../../../components/helpers/helperFunctions";
import styles from "../../../../styles/Home.module.scss";
import formStyles from "../../../../styles/Form.module.scss";
import detailsStyles from "../../../../styles/Details.module.scss";

// custom interface to avoid UI believing query params can be undefined when they can't be
interface SparrowQueryInterface extends ParsedUrlQuery {
  latestSensorData: Sensor;
  historicalSensorData: NotehubEvent[];
}

type SensorDetailsData = {
  latestSensorData: Sensor;
  historicalSensorData: NotehubEvent[];
};

const SensorDetails: NextPage<SensorDetailsData> = ({
  latestSensorData,
  historicalSensorData,
}) => {
  const { TabPane } = Tabs;
  const { query } = useRouter();

  const formItems: FormProps[] = [
    {
      label: "Last Updated",
      contents: (
        <div className={detailsStyles.timestamp}>
          {getFormattedLastSeen(latestSensorData?.lastActivity)}
        </div>
      ),
    },
    {
      label: "Name",
      name: "name",
      rules: [
        { required: true, message: "Please add the name of your sensor" },
      ],
      tooltip: "What is the name of your sensor?",
      contents: (
        <Input
          data-testid="form-input-sensor-name"
          placeholder="Name of sensor"
        />
      ),
    },
    {
      label: "Location",
      name: "loc",
      tooltip: "Where is your sensor located?",
      rules: [
        { required: true, message: "Please add the location of your sensor" },
      ],
      contents: (
        <Input
          data-testid="form-input-sensor-location"
          placeholder="Sensor location"
        />
      ),
    },
    {
      label: "Gateway",
      contents: <div className={formStyles.formData}>2nd Floor Gateway</div>,
    },
    {
      contents: (
        <Button data-testid="form-submit" htmlType="submit" type="primary">
          Save Changes
        </Button>
      ),
    },
  ];

  const formOnFinish = async (values: Store) => {
    const { gatewayUID, sensorUID } = query as SparrowQueryInterface;
    const response = await axios.post(
      `/api/gateway/${gatewayUID}/sensor/${sensorUID}/config`,
      values
    );
    console.log(`Success: ${response}`);
  };

  const formOnFinishFailed = (errorInfo: ValidateErrorEntity) => {
    console.log("Failed:", errorInfo);
  };

  const formattedTemperatureData =
    getFormattedTemperatureData(latestSensorData);
  const formattedHumidityData = getFormattedHumidityData(latestSensorData);
  const formattedPressureData = getFormattedPressureData(latestSensorData);
  const formattedVoltageData = getFormattedVoltageData(latestSensorData);

  const temperatureData = getFormattedChartData(
    historicalSensorData,
    "temperature"
  );
  const humidityData = getFormattedChartData(historicalSensorData, "humidity");
  const pressureData = getFormattedChartData(historicalSensorData, "pressure");
  const voltageData = getFormattedChartData(historicalSensorData, "voltage");

  return (
    <div>
      <h1 className={styles.sectionTitle}>Sensor: {latestSensorData.name}</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Summary" key="1">
          <h2 className={detailsStyles.tabSectionTitle}>Current Readings</h2>
          {/* none of this is styled b/c that's a separate story - just getting the api data to the client here */}
          <p className={detailsStyles.timestamp}>
            Last updated {getFormattedLastSeen(latestSensorData.lastActivity)}
          </p>

          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                Temperature
                <br />
                <span className={detailsStyles.dataNumber}>
                  {formattedTemperatureData || SENSOR_MESSAGE.NO_TEMPERATURE}
                </span>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                Humidity
                <br />
                <span className={detailsStyles.dataNumber}>
                  {formattedHumidityData || SENSOR_MESSAGE.NO_HUMIDITY}
                </span>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                Voltage
                <br />
                <span className={detailsStyles.dataNumber}>
                  {formattedVoltageData || SENSOR_MESSAGE.NO_VOLTAGE}
                </span>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <li>
                  Pressure
                  <br />
                  <span className={detailsStyles.dataNumber}>
                    {formattedPressureData || SENSOR_MESSAGE.NO_PRESSURE}
                  </span>
                </li>
              </Card>
            </Col>

            <Col span={12}>
              <Card>
                <h3>Temperature</h3>
                {temperatureData.length ? (
                  <SensorDetailsChart
                    label="Temperature"
                    yAxisMin={0}
                    yAxisMax={30}
                    data={temperatureData}
                    chartColor="#59d2ff"
                  />
                ) : (
                  HISTORICAL_SENSOR_DATA_MESSAGE.NO_TEMPERATURE_HISTORY
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <h3>Humidity</h3>
                {humidityData.length ? (
                  <SensorDetailsChart
                    label="Humidity"
                    yAxisMin={25}
                    yAxisMax={100}
                    data={humidityData}
                    chartColor="#ba68c8"
                  />
                ) : (
                  HISTORICAL_SENSOR_DATA_MESSAGE.NO_HUMIDITY_HISTORY
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <h3>Voltage</h3>
                {voltageData.length ? (
                  <SensorDetailsChart
                    label="Voltage"
                    yAxisMin={1}
                    yAxisMax={4}
                    data={voltageData}
                    chartColor="#9ccc65"
                  />
                ) : (
                  HISTORICAL_SENSOR_DATA_MESSAGE.NO_VOLTAGE_HISTORY
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <h3>Pressure</h3>
                {pressureData.length ? (
                  <SensorDetailsChart
                    label="Pressure"
                    yAxisMin={99000}
                    yAxisMax={105000}
                    data={pressureData}
                    chartColor="#ffd54f"
                  />
                ) : (
                  HISTORICAL_SENSOR_DATA_MESSAGE.NO_PRESSURE_HISTORY
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Device Details" key="2">
          <Form
            formItems={formItems}
            onFinish={formOnFinish}
            onFinishFailed={formOnFinishFailed}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SensorDetails;

export const getServerSideProps: GetServerSideProps<SensorDetailsData> =
  async ({ query }) => {
    // extended interface needed to eliminate TS error of possible undefined string values
    // the query string values will never be undefined in this situation
    const { gatewayUID, sensorUID } = query as SparrowQueryInterface;

    const { latestSensorData, historicalSensorData } =
      await getSensorDetailsData(gatewayUID, sensorUID);

    return {
      props: { latestSensorData, historicalSensorData },
    };
  };
