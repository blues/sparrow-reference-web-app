import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Input, Button, Tabs } from "antd";
import axios from "axios";
import { Store } from "antd/lib/form/interface";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { ParsedUrlQuery } from "querystring";
import Form, { FormProps } from "../../../../components/elements/Form";
import Sensor from "../../../../components/models/Sensor";
import SensorDetailsChart from "../../../../components/charts/SensorDetailsChart";
import {
  getErrorMessage,
  HISTORICAL_SENSOR_DATA_MESSAGE,
} from "../../../../constants/ui";
import styles from "../../../../styles/Form.module.scss";
import { services } from "../../../../services/ServiceLocator";
import SensorReading from "../../../../components/models/SensorReading";
import SensorDetailViewModel from "../../../../models/SensorDetailViewModel";
import { getSensorDetailsPresentation } from "../../../../components/presentation/sensorDetails";
import { ERROR_CODES } from "../../../../services/Errors";

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
        <div className={styles.formData}>{viewModel.sensor?.lastActivity}</div>
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
      contents: <div className={styles.formData}>2nd Floor Gateway</div>,
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
          <h1>{viewModel.sensor.name}</h1>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Summary" key="1">
              <h2>Current Readings</h2>
              <p>Last Seen: {viewModel.sensor.lastActivity}</p>
              <ul>
                <li>Temperature: {viewModel.sensor.temperature}</li>
                <li>Humidity: {viewModel.sensor.humidity}</li>
                <li>Pressure: {viewModel.sensor.pressure}</li>
                <li>Voltage: {viewModel.sensor.voltage}</li>
              </ul>
              <h3>Voltage</h3>
              {viewModel.readings?.voltage.length ? (
                <SensorDetailsChart
                  label="Voltage"
                  yAxisMin={1}
                  yAxisMax={4}
                  data={viewModel.readings.voltage}
                />
              ) : (
                HISTORICAL_SENSOR_DATA_MESSAGE.NO_VOLTAGE_HISTORY
              )}
              <h3>Temperature</h3>
              {viewModel.readings?.temperature.length ? (
                <SensorDetailsChart
                  label="Temperature"
                  yAxisMin={0}
                  yAxisMax={30}
                  data={viewModel.readings.temperature}
                />
              ) : (
                HISTORICAL_SENSOR_DATA_MESSAGE.NO_TEMPERATURE_HISTORY
              )}
              <h3>Humidity</h3>
              {viewModel.readings?.humidity.length ? (
                <SensorDetailsChart
                  label="Humidity"
                  yAxisMin={25}
                  yAxisMax={100}
                  data={viewModel.readings.humidity}
                />
              ) : (
                HISTORICAL_SENSOR_DATA_MESSAGE.NO_HUMIDITY_HISTORY
              )}
              <h3>Pressure</h3>
              {viewModel.readings?.pressure.length ? (
                <SensorDetailsChart
                  label="Pressure"
                  yAxisMin={99000}
                  yAxisMax={105000}
                  data={viewModel.readings.pressure}
                />
              ) : (
                HISTORICAL_SENSOR_DATA_MESSAGE.NO_PRESSURE_HISTORY
              )}
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
