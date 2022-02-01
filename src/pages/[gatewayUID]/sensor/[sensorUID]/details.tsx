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
  SENSOR_MESSAGE,
} from "../../../../constants/ui";
import {
  getFormattedChartData,
  getFormattedTemperatureData,
  getFormattedHumidityData,
  getFormattedPressureData,
  getFormattedVoltageData,
} from "../../../../components/helpers/helperFunctions";
import styles from "../../../../styles/Form.module.scss";
import { services } from "../../../../services/ServiceLocator";
import SensorReading from "../../../../components/models/SensorReading";

// custom interface to avoid UI believing query params can be undefined when they can't be
interface SparrowQueryInterface extends ParsedUrlQuery {
  gatewayUID: string;
  sensorUID: string;
}

type SensorDetailsData = {
  sensorData: Sensor | null;
  sensorReadings: SensorReading[];
  err?: string;
};

const SensorDetails: NextPage<SensorDetailsData> = ({
  sensorData,
  sensorReadings,
  err,
}) => {
  const { TabPane } = Tabs;
  const { query } = useRouter();

  const formItems: FormProps[] = [
    {
      label: "Last Updated",
      contents: (
        <div className={styles.formData}>{sensorData?.lastActivity}</div>
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

  const temperatureData = getFormattedChartData(sensorReadings, "temperature");
  const humidityData = getFormattedChartData(sensorReadings, "humidity");
  const pressureData = getFormattedChartData(sensorReadings, "pressure");
  const voltageData = getFormattedChartData(sensorReadings, "voltage");

  return (
    <>
      {err && <h2 className={styles.errorMessage}>{err}</h2>}

      {sensorData && (
        <div>
          <h1>{sensorData.name}</h1>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Summary" key="1">
              <h2>Current Readings</h2>
              {/* none of this is styled b/c that's a separate story - just getting the api data to the client here */}
              <p>Last Seen: {sensorData.lastActivity}</p>
              <ul>
                <li>
                  Temperature:&nbsp;
                  {getFormattedTemperatureData(sensorData) ||
                    SENSOR_MESSAGE.NO_TEMPERATURE}
                </li>
                <li>
                  Humidity:&nbsp;
                  {getFormattedHumidityData(sensorData) ||
                    SENSOR_MESSAGE.NO_HUMIDITY}
                </li>
                <li>
                  Pressure:&nbsp;
                  {getFormattedPressureData(sensorData) ||
                    SENSOR_MESSAGE.NO_PRESSURE}
                </li>
                <li>
                  Voltage:&nbsp;
                  {getFormattedVoltageData(sensorData) ||
                    SENSOR_MESSAGE.NO_VOLTAGE}
                </li>
              </ul>
              <h3>Voltage</h3>
              {voltageData.length ? (
                <SensorDetailsChart
                  label="Voltage"
                  yAxisMin={1}
                  yAxisMax={4}
                  data={voltageData}
                />
              ) : (
                HISTORICAL_SENSOR_DATA_MESSAGE.NO_VOLTAGE_HISTORY
              )}
              <h3>Temperature</h3>
              {temperatureData.length ? (
                <SensorDetailsChart
                  label="Temperature"
                  yAxisMin={0}
                  yAxisMax={30}
                  data={temperatureData}
                />
              ) : (
                HISTORICAL_SENSOR_DATA_MESSAGE.NO_TEMPERATURE_HISTORY
              )}
              <h3>Humidity</h3>
              {humidityData.length ? (
                <SensorDetailsChart
                  label="Humidity"
                  yAxisMin={25}
                  yAxisMax={100}
                  data={humidityData}
                />
              ) : (
                HISTORICAL_SENSOR_DATA_MESSAGE.NO_HUMIDITY_HISTORY
              )}
              <h3>Pressure</h3>
              {pressureData.length ? (
                <SensorDetailsChart
                  label="Pressure"
                  yAxisMin={99000}
                  yAxisMax={105000}
                  data={pressureData}
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
    let sensorData: Sensor | null = null;
    let sensorReadings: SensorReading[] = [];

    try {
      sensorData = await appService.getSensor(gatewayUID, sensorUID);
      sensorReadings = await appService.getSensorData(gatewayUID, sensorUID);

      return {
        props: { sensorData, sensorReadings },
      };
    } catch (err) {
      if (err instanceof Error) {
        return {
          props: {
            sensorData,
            sensorReadings,
            err: getErrorMessage(err.message),
          },
        };
      }
      return { props: { sensorData, sensorReadings } };
    }
  };
