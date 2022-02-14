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

  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace(router.asPath);
  };

  const formItems: FormProps[] = [
    {
      label: (
        <h3
          data-testid="current-readings"
          className={detailsStyles.tabSectionTitle}
        >
          Current Readings
        </h3>
      ),
      contents: (
        <div className={detailsStyles.sensorFormTimestamp}>
          Last updated&nbsp;{viewModel.sensor?.lastActivity}
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
          maxLength={49}
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
          maxLength={15}
        />
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
    console.log(`Success`);
    console.log(response);

    if (response.status < 300) {
      refreshData();
    }
  };

  const formOnFinishFailed = (errorInfo: ValidateErrorEntity) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {err && <h2 className={styles.errorMessage}>{err}</h2>}
      {viewModel.sensor && (
        <div>
          <h2 data-testid="sensor-name" className={styles.sectionTitle}>
            Sensor:&nbsp;{viewModel.sensor.name}
          </h2>
          <h3
            data-testid="sensor-gateway-name"
            className={styles.sectionSubHeader}
          >
            Gateway:&nbsp;
            {viewModel.gateway?.serialNumber && viewModel.gateway.serialNumber}
          </h3>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Summary" key="1">
              <h3
                data-testid="current-readings"
                className={detailsStyles.tabSectionTitle}
              >
                Current Readings
              </h3>
              <p
                data-testid="last-seen"
                className={detailsStyles.sensorTimestamp}
              >
                Last updated {viewModel.sensor.lastActivity}
              </p>

              <Row gutter={[8, 16]}>
                <Col xs={7} sm={6} lg={6}>
                  <Card
                    className={detailsStyles.card}
                    data-testid="temperature"
                  >
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
                      data-testid="last-seen-pressure"
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
      const gateway = await appService.getGateway(gatewayUID);
      const sensor = await appService.getSensor(gatewayUID, sensorUID);
      const readings = await appService.getSensorData(gatewayUID, sensorUID);
      viewModel = getSensorDetailsPresentation(sensor, gateway, readings);

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
