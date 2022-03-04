import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Card, Input, Button, Tabs, Row, Col, Tooltip } from "antd";
import axios from "axios";
import { Store } from "antd/lib/form/interface";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { ParsedUrlQuery } from "querystring";
import Form, { FormProps } from "../../../../components/elements/Form";
import {
  getErrorMessage,
  HISTORICAL_SENSOR_DATA_MESSAGE,
  NODE_MESSSAGE,
} from "../../../../constants/ui";
import { services } from "../../../../services/ServiceLocator";
import NodeDetailViewModel from "../../../../models/NodeDetailViewModel";
import { getNodeDetailsPresentation } from "../../../../components/presentation/nodeDetails";
import { ERROR_CODES } from "../../../../services/Errors";
import styles from "../../../../styles/Home.module.scss";
import detailsStyles from "../../../../styles/Details.module.scss";
import TemperatureSensorSchema from "../../../../components/models/readings/TemperatureSensorSchema";
import HumiditySensorSchema from "../../../../components/models/readings/HumiditySensorSchema";
import VoltageSensorSchema from "../../../../components/models/readings/VoltageSensorSchema";
import PressureSensorSchema from "../../../../components/models/readings/PressureSensorSchema";
import CountSensorSchema from "../../../../components/models/readings/CountSensorSchema";

const DynamicLineChart = dynamic(
  () => import("../../../../components/charts/SensorDetailsLineChart"),
  { ssr: false }
);
const DynamicBarChart = dynamic(
  () => import("../../../../components/charts/SensorDetailsBarChart"),
  { ssr: false }
);

// custom interface to avoid UI believing query params can be undefined when they can't be
interface SparrowQueryInterface extends ParsedUrlQuery {
  gatewayUID: string;
  nodeId: string;
}

type NodeDetailsData = {
  viewModel: NodeDetailViewModel;
  err?: string;
};

const NodeDetails: NextPage<NodeDetailsData> = ({ viewModel, err }) => {
  const { TabPane } = Tabs;
  const { query } = useRouter();

  const router = useRouter();
  // Call this function whenever you want to
  // refresh props!
  const refreshData = async () => {
    await router.replace(router.asPath);
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
        <div className={detailsStyles.nodeFormTimestamp}>
          Last updated{` `}
          {viewModel.node?.lastActivity}
        </div>
      ),
    },
    {
      label: "Name",
      name: "name",
      tooltip: "What is the name of your node?",
      initialValue:
        viewModel.node?.name !== NODE_MESSSAGE.NO_NAME
          ? viewModel.node?.name
          : undefined,
      rules: [{ required: true, message: "Please add the name of your node" }],
      contents: (
        <Input
          data-testid="form-input-node-name"
          placeholder="Name of node"
          maxLength={49}
          showCount
        />
      ),
    },
    {
      label: "Location",
      name: "location",
      tooltip: "Where is your node located?",
      initialValue:
        viewModel.node?.location !== NODE_MESSSAGE.NO_LOCATION
          ? viewModel.node?.location
          : undefined,
      rules: [
        { required: true, message: "Please add the location of your node" },
      ],
      contents: (
        <Input
          data-testid="form-input-node-location"
          placeholder="Node location"
          maxLength={15}
          showCount
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
    const { gatewayUID, nodeId } = query as SparrowQueryInterface;
    // TODO: Move this to the app service / data provider
    const response = await axios.post(
      `/api/gateway/${gatewayUID}/node/${nodeId}/config`,
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
      {viewModel.node && (
        <div>
          <h2 data-testid="node-name" className={styles.sectionTitle}>
            Node:{` `}
            {viewModel.node.name}
          </h2>
          <h3
            data-testid="node-gateway-name"
            className={styles.sectionSubHeader}
          >
            Gateway:{` `}
            {viewModel?.gateway?.serialNumber && viewModel.gateway.serialNumber}
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
                className={detailsStyles.nodeTimestamp}
              >
                Last updated {viewModel.node.lastActivity}
              </p>

              <Row
                justify="start"
                className={detailsStyles.currentReadingsRow}
                gutter={[8, 16]}
              >
                <Col xs={12} sm={12} lg={5}>
                  <Card
                    className={detailsStyles.card}
                    data-testid="temperature"
                  >
                    Temperature
                    <br />
                    <span className={detailsStyles.dataNumber}>
                      {viewModel.node.temperature}
                    </span>
                  </Card>
                </Col>
                <Col xs={12} sm={12} lg={5}>
                  <Card className={detailsStyles.card} data-testid="humidity">
                    Humidity
                    <br />
                    <span className={detailsStyles.dataNumber}>
                      {viewModel.node.humidity}
                    </span>
                  </Card>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Card className={detailsStyles.card} data-testid="voltage">
                    Voltage
                    <br />
                    <span className={detailsStyles.dataNumber}>
                      {viewModel.node.voltage}
                    </span>
                  </Card>
                </Col>
                <Col xs={12} sm={12} lg={5}>
                  <Card className={detailsStyles.card} data-testid="pressure">
                    Pressure
                    <br />
                    <span className={detailsStyles.dataNumber}>
                      {viewModel.node.pressure}
                    </span>
                  </Card>
                </Col>
                <Col xs={12} sm={12} lg={5}>
                  <Card
                    className={detailsStyles.card}
                    data-testid="motion-count"
                  >
                    <Tooltip
                      title={`Total motions detected by ${viewModel.node?.name}: ${viewModel.node.total}`}
                    >
                      Motion
                      <br />
                      <span className={detailsStyles.dataNumber}>
                        {viewModel.node.count}
                      </span>
                    </Tooltip>
                  </Card>
                </Col>
              </Row>
              <Row justify="start" gutter={[8, 16]}>
                <Col xs={24} sm={24} lg={12}>
                  <Card className={detailsStyles.sensorChart}>
                    <h3>Temperature</h3>
                    <p
                      data-testid="last-seen-temperature"
                      className={detailsStyles.nodeChartTimestamp}
                    >
                      Last updated {viewModel.node.lastActivity}
                    </p>
                    {viewModel.readings?.temperature.length ? (
                      <DynamicLineChart
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
                      className={detailsStyles.nodeChartTimestamp}
                    >
                      Last updated {viewModel.node.lastActivity}
                    </p>
                    {viewModel.readings?.humidity.length ? (
                      <DynamicLineChart
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
                      className={detailsStyles.nodeChartTimestamp}
                    >
                      Last updated {viewModel.node.lastActivity}
                    </p>
                    {viewModel.readings?.voltage.length ? (
                      <DynamicLineChart
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
                      className={detailsStyles.nodeChartTimestamp}
                    >
                      Last updated {viewModel.node.lastActivity}
                    </p>
                    {viewModel.readings?.pressure.length ? (
                      <DynamicLineChart
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
                <Col xs={24} sm={24} lg={12}>
                  <Card className={detailsStyles.sensorChart}>
                    <h3>Motion Count</h3>
                    <p
                      data-testid="last-seen-count"
                      className={detailsStyles.nodeChartTimestamp}
                    >
                      Last updated {viewModel.node.lastActivity}
                    </p>
                    {viewModel.readings?.count.length ? (
                      <DynamicBarChart
                        label="Count"
                        data={viewModel.readings.count}
                        chartColor="#ff7e6d"
                        schema={CountSensorSchema}
                      />
                    ) : (
                      HISTORICAL_SENSOR_DATA_MESSAGE.NO_COUNT_HISTORY
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

export default NodeDetails;

export const getServerSideProps: GetServerSideProps<NodeDetailsData> = async ({
  query,
}) => {
  const { gatewayUID, nodeId } = query as SparrowQueryInterface;
  const appService = services().getAppService();
  let viewModel: NodeDetailViewModel = {};

  try {
    const gateway = await appService.getGateway(gatewayUID);
    const sensor = await appService.getNode(gatewayUID, nodeId);
    const readings = await appService.getNodeData(gatewayUID, nodeId);
    viewModel = getNodeDetailsPresentation(sensor, gateway, readings);

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
