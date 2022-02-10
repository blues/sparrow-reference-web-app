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
  GATEWAY_MESSAGE,
} from "../../../../constants/ui";
import { services } from "../../../../services/ServiceLocator";
import SensorDetailViewModel from "../../../../models/SensorDetailViewModel";
import Gateway from "../../../../components/models/Gateway";
import { getSensorDetailsPresentation } from "../../../../components/presentation/sensorDetails";
import { ERROR_CODES } from "../../../../services/Errors";
import styles from "../../../../styles/Home.module.scss";
import detailsStyles from "../../../../styles/Details.module.scss";

// custom interface to avoid UI believing query params can be undefined when they can't be
interface SparrowQueryInterface extends ParsedUrlQuery {
  gatewayUID: string;
  sensorUID: string;
}

type SensorDetailsData = {
  gateway?: Gateway;
  viewModel: SensorDetailViewModel;
  err?: string;
};

const SensorDetails: NextPage<SensorDetailsData> = ({
  gateway,
  viewModel,
  err,
}) => {
  const formattedLocation =
    gateway && gateway?.location
      ? gateway.location
      : GATEWAY_MESSAGE.NO_LOCATION;

  const { TabPane } = Tabs;
  const { query } = useRouter();

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
      label: "Gateway Location",
      contents: (
        <div data-testid="sensor-gateway-name" className={styles.formData}>
          {formattedLocation}
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
    console.log(`Success`);
    console.log(response);
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
          <h3 className={styles.sectionSubHeader}>
            Gateway:&nbsp;{gateway?.serialNumber && gateway.serialNumber}
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
                <Col span={6}>
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
                <Col span={6}>
                  <Card className={detailsStyles.card} data-testid="humidity">
                    Humidity
                    <br />
                    <span className={detailsStyles.dataNumber}>
                      {viewModel.sensor.humidity}
                    </span>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card className={detailsStyles.card} data-testid="voltage">
                    Voltage
                    <br />
                    <span className={detailsStyles.dataNumber}>
                      {viewModel.sensor.voltage}
                    </span>
                  </Card>
                </Col>
                <Col span={6}>
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
                <Col span={12}>
                  <Card>
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
                        yAxisMin={0}
                        yAxisMax={30}
                        data={viewModel.readings.temperature}
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
                    <p
                      data-testid="last-seen-humidity"
                      className={detailsStyles.sensorChartTimestamp}
                    >
                      Last updated {viewModel.sensor.lastActivity}
                    </p>
                    {viewModel.readings?.humidity.length ? (
                      <SensorDetailsChart
                        label="Humidity"
                        yAxisMin={25}
                        yAxisMax={100}
                        data={viewModel.readings.humidity}
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
                    <p
                      data-testid="last-seen-voltage"
                      className={detailsStyles.sensorChartTimestamp}
                    >
                      Last updated {viewModel.sensor.lastActivity}
                    </p>
                    {viewModel.readings?.voltage.length ? (
                      <SensorDetailsChart
                        label="Voltage"
                        yAxisMin={1}
                        yAxisMax={4}
                        data={viewModel.readings.voltage}
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
                    <p
                      data-testid="last-seen-pressure"
                      className={detailsStyles.sensorChartTimestamp}
                    >
                      Last updated {viewModel.sensor.lastActivity}
                    </p>
                    {viewModel.readings?.pressure.length ? (
                      <SensorDetailsChart
                        label="Pressure"
                        yAxisMin={99000}
                        yAxisMax={105000}
                        data={viewModel.readings.pressure}
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
    let gateway: Gateway | null = null;

    try {
      gateway = await appService.getGateway(gatewayUID);
      const sensor = await appService.getSensor(gatewayUID, sensorUID);
      const readings = await appService.getSensorData(gatewayUID, sensorUID);
      viewModel = getSensorDetailsPresentation(sensor, readings);

      return {
        props: { gateway, viewModel },
      };
    } catch (err) {
      if (err instanceof Error) {
        return {
          props: {
            gateway,
            viewModel,
            err: getErrorMessage(err.message),
          },
        };
      }
      return {
        props: {
          gateway,
          viewModel,
          err: getErrorMessage(ERROR_CODES.INTERNAL_ERROR),
        },
      };
    }
  };
