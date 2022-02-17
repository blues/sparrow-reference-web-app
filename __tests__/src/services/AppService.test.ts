import Gateway from "../../../src/components/models/Gateway";
import Sensor from "../../../src/components/models/Sensor";
import SensorDetailViewModel from "../../../src/models/SensorDetailViewModel";
import AppService from "../../../src/services/AppService";
import { DataProvider } from "../../../src/services/DataProvider";
import sparrowData from "./__serviceMocks__/sparrowData.json";

describe("App Service", () => {
  let dataProviderMock: DataProvider;
  let appServiceMock: AppService;

  const { mockedGatewayUID } = sparrowData;

  const { mockedSensorUID } = sparrowData;

  const mockedGatewaySparrowData =
    sparrowData.successfulGatewaySparrowDataResponse as Gateway;

  const mockedGatewaysSparrowData = [
    sparrowData.successfulGatewaySparrowDataResponse as Gateway,
  ];

  const mockedSensorSparrowData =
    sparrowData.successfulSensorSparrowDataResponse as Sensor[];

  const mockedSensorsSparrowData = [
    sparrowData.successfulSensorSparrowDataResponse as Sensor[],
  ];

  const mockedSensorDataSparrowData =
    sparrowData.successfulSensorDataSparrowDataResponse as SensorDetailViewModel;

  beforeEach(() => {
    dataProviderMock = {
      getGateway: jest.fn().mockResolvedValueOnce(mockedGatewaySparrowData),
      getGateways: jest.fn().mockResolvedValueOnce(mockedGatewaysSparrowData),
      getSensor: jest.fn().mockResolvedValueOnce(mockedSensorSparrowData),
      getSensors: jest.fn().mockResolvedValueOnce(mockedSensorsSparrowData),
      getSensorData: jest
        .fn()
        .mockResolvedValueOnce(mockedSensorDataSparrowData),
    };
    appServiceMock = new AppService(dataProviderMock);
  });

  it("should return a single gateway when getGateway is called", async () => {
    const res = await appServiceMock.getGateway(mockedGatewayUID);
    expect(res).toEqual(mockedGatewaySparrowData);
  });

  it("should return a list of gateways when getGateways is called", async () => {
    const res = await appServiceMock.getGateways();
    expect(res).toEqual(mockedGatewaysSparrowData);
  });

  it("should return a single sensor when getSensor is called", async () => {
    const res = await appServiceMock.getSensor(
      mockedGatewayUID,
      mockedSensorUID
    );
    expect(res).toEqual(mockedSensorSparrowData);
  });

  it("should return a list of sensors when getSensors is called", async () => {
    const res = await appServiceMock.getSensors([mockedGatewayUID]);
    expect(res).toEqual(mockedSensorsSparrowData);
  });

  it("should return a list of sensor data when getSensorData is called", async () => {
    const res = await appServiceMock.getSensorData(
      mockedGatewayUID,
      mockedSensorUID
    );
    expect(res).toEqual(mockedSensorDataSparrowData);
  });
});
