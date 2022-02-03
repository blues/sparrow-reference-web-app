import AppService from "../../../src/services/AppService";
import { DataProvider } from "../../../src/services/DataProvider";
import sparrowData from "./__serviceMocks__/sparrowData.json";

describe("App Service", () => {
  let dataProviderMock: DataProvider;
  let appServiceMock: AppService;

  const { mockedGatewayUID } = sparrowData;

  const { mockedSensorUID } = sparrowData;

  const mockedGatewaySparrowData =
    sparrowData.successfulGatewaySparrowDataResponse;

  const mockedGatewaysSparrowData = [
    sparrowData.successfulGatewaySparrowDataResponse,
  ];

  const mockedSensorSparrowData =
    sparrowData.successfulSensorSparrowDataResponse;

  const mockedSensorsSparrowData = [
    sparrowData.successfulSensorSparrowDataResponse,
  ];

  beforeEach(() => {
    dataProviderMock = {
      getGateway: jest.fn().mockResolvedValueOnce(mockedGatewaySparrowData),
      getGateways: jest.fn().mockResolvedValueOnce(mockedGatewaysSparrowData),
      getSensor: jest.fn().mockResolvedValueOnce(mockedSensorSparrowData),
      getSensors: jest.fn(),
      getSensorData: jest.fn(),
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
});
