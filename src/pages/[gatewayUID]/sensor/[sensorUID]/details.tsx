import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Card, Input, Button, Tabs, Row, Col } from "antd";
import axios from "axios";
import { Store } from "antd/lib/form/interface";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { ParsedUrlQuery } from "querystring";
import Form, { FormProps } from "../../../../components/elements/Form";
import SensorDetailsChart from "../../../../components/charts/SensorDetailsChart";
import {
  getErrorMessage,
  HISTORICAL_SENSOR_DATA_MESSAGE,
} from "../../../../constants/ui";
import { services } from "../../../../services/ServiceLocator";
import SensorDetailViewModel from "../../../../models/SensorDetailViewModel";
import { getSensorDetailsPresentation } from "../../../../components/presentation/sensorDetails";
import { ERROR_CODES } from "../../../../services/Errors";
import styles from "../../../../styles/Home.module.scss";
import detailsStyles from "../../../../styles/Details.module.scss";
import TemperatureSensorSchema from "../../../../components/models/readings/TemperatureSensorSchema";
import HumiditySensorSchema from "../../../../components/models/readings/HumiditySensorSchema";
import VoltageSensorSchema from "../../../../components/models/readings/VoltageSensorSchema";
import PressureSensorSchema from "../../../../components/models/readings/PressureSensorSchema";

// custom interface to avoid UI believing query params can be undefined when they can't be
interface SparrowQueryInterface extends ParsedUrlQuery {
  gatewayUID: string;
  sensorUID: string;
}

type SensorDetailsData = {
  viewModel: SensorDetailViewModel;
  err?: string;
};

const SensorDetails: NextPage<SensorDetailsData> = ({ viewModel, err }) => {
  const { TabPane } = Tabs;
  const { query } = useRouter();

  const formItems: FormProps[] = [
    {
      label: "Last Updated",
      contents: (
        <div className={detailsStyles.timestamp}>
          {viewModel.sensor?.lastActivity}
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
      contents: (
        <div data-testid="sensor-gateway-name" className={styles.formData}>
          2nd Floor Gateway
        </div>
      ),
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
    // TODO: Move this to the app service / data provider
    const response = await axios.post(
      `/api/gateway/${gatewayUID}/sensor/${sensorUID}/config`,
      values
    );
    console.log(`Success: ${response}`);
  };

  const formOnFinishFailed = (errorInfo: ValidateErrorEntity) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {err && <h2 className={styles.errorMessage}>{err}</h2>}
      {viewModel.sensor && (
        <div>
          <h1 data-testid="sensor-name" className={styles.sectionTitle}>
            Sensor: {viewModel.sensor.name}
          </h1>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Summary" key="1">
              <h2
                data-testid="current-readings"
                className={detailsStyles.tabSectionTitle}
              >
                Current Readings
              </h2>
              <p data-testid="last-seen" className={detailsStyles.timestamp}>
                Last updated {viewModel.sensor.lastActivity}
              </p>

              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Card data-testid="temperature">
                    Temperature
                    <br />
                    <span className={detailsStyles.dataNumber}>
                      {viewModel.sensor.temperature}
                    </span>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card data-testid="humidity">
                    Humidity
                    <br />
                    <span className={detailsStyles.dataNumber}>
                      {viewModel.sensor.humidity}
                    </span>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card data-testid="voltage">
                    Voltage
                    <br />
                    <span className={detailsStyles.dataNumber}>
                      {viewModel.sensor.voltage}
                    </span>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card data-testid="pressure">
                    <li>
                      Pressure
                      <br />
                      <span className={detailsStyles.dataNumber}>
                        {viewModel.sensor.pressure}
                      </span>
                    </li>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <h3>Temperature</h3>
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
                <Col span={12}>
                  <Card>
                    <h3>Humidity</h3>
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
                <Col span={12}>
                  <Card>
                    <h3>Voltage</h3>
                    {viewModel.readings?.voltage.length ? (
                      <SensorDetailsChart
                        label="Voltage"
                        yAxisMin={0}
                        yAxisMax={5}
                        data={viewModel.readings.voltage}
                        chartColor="#9ccc65"
                        schema={VoltageSensorSchema}
                      />
                    ) : (
                      HISTORICAL_SENSOR_DATA_MESSAGE.NO_VOLTAGE_HISTORY
                    )}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <h3>Pressure</h3>
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
      )}
    </>
  );
};

export default SensorDetails;

export const getServerSideProps: GetServerSideProps<SensorDetailsData> =
  async ({ query }) => {
    const { gatewayUID, sensorUID } = query as SparrowQueryInterface;
    const appService = services().getAppService();
    let viewModel: SensorDetailViewModel = {};

    try {
      const sensor = await appService.getSensor(gatewayUID, sensorUID);
      const readings = await appService.getSensorData(gatewayUID, sensorUID);
      viewModel = getSensorDetailsPresentation(sensor, readings);

      return {
        props: { viewModel },
      };
    } catch (err) {
      if (err instanceof Error) {
        return {
          props: {
            viewModel,
            err: getErrorMessage(err.message),
          },
        };
      }
      return {
        props: {
          viewModel,
          err: getErrorMessage(ERROR_CODES.INTERNAL_ERROR),
        },
      };
    }
  };
