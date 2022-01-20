import { NotehubAccessor } from "../../../../src/services/notehub/NotehubAccessor";
import NotehubDataProvider from "../../../../src/services/notehub/NotehubDataProvider";
import sparrowData from "../__serviceMocks__/sparrowData.json"; // mocked data to do with Sparrow portion of app goes here (i.e. gateways and sensors)
import notehubData from "../__serviceMocks__/notehubData.json"; // mocked data to do with Notehub portion of app goes here (i.e. devices and events)

describe("Notehub data provider service functions", () => {
  const mockedGatewayJson = notehubData.successfulNotehubDeviceResponse;

  let notehubAccessorMock: NotehubAccessor;
  let notehubDataProviderMock: NotehubDataProvider;

  beforeEach(() => {
    notehubAccessorMock = {
      getGateway: jest.fn().mockResolvedValueOnce(mockedGatewayJson),
    };
    notehubDataProviderMock = new NotehubDataProvider(notehubAccessorMock);
  });

  it("should return a single sparrow gateway instance when getGateway is called", async () => {
    const mockGatewayUID = "dev:5678";

    const mockedGatewaySparrowData =
      sparrowData.successfulGatewaySparrowDataResponse;

    const res = await notehubDataProviderMock.getGateway(mockGatewayUID);
    expect(res).toEqual(mockedGatewaySparrowData);
  });

  it("should return a list sparrow gateway instances when getGateways is called", async () => {
    const mockedGatewaysSparrowData = [
      sparrowData.successfulGatewaySparrowDataResponse,
    ];

    const res = await notehubDataProviderMock.getGateways();
    expect(res).toEqual(mockedGatewaysSparrowData);
  });
});
