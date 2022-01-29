import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Input, Button, Tabs } from "antd";
import axios from "axios";
import { Store } from "antd/lib/form/interface";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import Form, { FormProps } from "../../../../components/elements/Form";
import getSensorDetailsData from "../../../../services/sensorDetailsData";
import Sensor from "../../../../components/models/Sensor";
import SensorDetailsChart from "../../../../components/charts/SensorDetailsChart";
import NotehubEvent from "../../../../services/notehub/models/NotehubEvent";
import {
  HISTORICAL_SENSOR_DATA_MESSAGE,
  SENSOR_MESSAGE,
} from "../../../../constants/ui";
import SparrowQueryInterface from "../../../../interfaces/SparrowQueryInterface";
import {
  getFormattedChartData,
  getFormattedTemperatureData,
  getFormattedHumidityData,
  getFormattedPressureData,
  getFormattedVoltageData,
} from "../../../../components/helpers/helperFunctions";
import styles from "../../../../styles/Form.module.scss";

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
        <div className={styles.formData}>{latestSensorData?.lastActivity}</div>
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
      contents: <div data-testid="sensor-gateway-name" className={styles.formData}>2nd Floor Gateway</div>,
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
      <h1 data-testid="sensor-name">{latestSensorData.name}</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Summary" key="1">
          <h2 data-testid="current-readings">Current Readings</h2>
          {/* none of this is styled b/c that's a separate story - just getting the api data to the client here */}
          <p data-testid="last-seen">Last Seen: {latestSensorData.lastActivity}</p>
          <ul>
            <li data-testid="temperature">
              Temperature:&nbsp;
              {formattedTemperatureData || SENSOR_MESSAGE.NO_TEMPERATURE}
            </li>
            <li data-testid="humidity">
              Humidity:&nbsp;
              {formattedHumidityData || SENSOR_MESSAGE.NO_HUMIDITY}
            </li>
            <li data-testid="pressure">
              Pressure:&nbsp;
              {formattedPressureData || SENSOR_MESSAGE.NO_PRESSURE}
            </li>
            <li data-testid="voltage">
              Voltage:&nbsp;
              {formattedVoltageData || SENSOR_MESSAGE.NO_VOLTAGE}
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
