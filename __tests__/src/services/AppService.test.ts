import AppService from "../../../src/services/AppService";
import { DataProvider } from "../../../src/services/interfaces/DataProvider";

describe("App Service", () => {
  let dataProviderMock: DataProvider;
  let appServiceMock: AppService;

  const mockedGatewaySparrowData = {
    lastActivity: "2021-11-27T03:56:29Z",
    serialNumber: "010203",
    uid: "dev:3456",
    voltage: 4.4,
  };

  const mockedGatewaysSparrowData = [
    {
      lastActivity: "2021-11-16T20:08:55Z",
      serialNumber: "020304",
      uid: "dev:3456",
      voltage: 5.0,
    },
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
