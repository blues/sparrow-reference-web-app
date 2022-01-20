import AppService from "../../../src/services/AppService";
import { DataProvider } from "../../../src/services/DataProvider";
import sparrowData from "./__serviceMocks__/sparrowData.json";

describe("App Service", () => {
  let dataProviderMock: DataProvider;
  let appServiceMock: AppService;

  const mockedGatewaySparrowData =
    sparrowData.successfulGatewaySparrowDataResponse;

  const mockedGatewaysSparrowData = [
    sparrowData.successfulGatewaySparrowDataResponse,
  ];

  beforeEach(() => {
    dataProviderMock = {
      getGateway: jest.fn().mockResolvedValueOnce(mockedGatewaySparrowData),
      getGateways: jest.fn().mockResolvedValueOnce(mockedGatewaysSparrowData),
      // placeholder mocked function to keep TS from yelling
      getLatestSensorData: jest.fn(),
    };
    appServiceMock = new AppService(dataProviderMock);
  });

  it("should return a single gateway when getGateway is called", async () => {
    const mockGatewayUID = "dev:5678";

    const res = await appServiceMock.getGateway(mockGatewayUID);
    expect(res).toEqual(mockedGatewaySparrowData);
  });

  it("should return a list of gateways when getGateways is called", async () => {
    const res = await appServiceMock.getGateways();
    expect(res).toEqual(mockedGatewaysSparrowData);
  });
});
