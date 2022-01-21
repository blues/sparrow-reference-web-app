import { NotehubAccessor } from "../../../../src/services/notehub/NotehubAccessor";
import NotehubDataProvider, {
  notehubDeviceToSparrowGateway,
} from "../../../../src/services/notehub/NotehubDataProvider";
import sparrowData from "../__serviceMocks__/sparrowData.json"; // mocked data to do with Sparrow portion of app goes here (i.e. gateways and sensors)
import notehubData from "../__serviceMocks__/notehubData.json"; // mocked data to do with Notehub portion of app goes here (i.e. devices and events)
import NotehubDevice from "../../../../src/services/notehub/models/NotehubDevice";

describe("Notehub data provider service functions", () => {
  const mockedGatewayJson = notehubData.successfulNotehubDeviceResponse;

  let notehubAccessorMock: NotehubAccessor;
  let notehubDataProviderMock: NotehubDataProvider;

  beforeEach(() => {
    notehubAccessorMock = {
      getGateway: jest.fn().mockResolvedValueOnce(mockedGatewayJson),
      getGateways: jest.fn().mockResolvedValueOnce([mockedGatewayJson]),
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

describe("Notehub data parsing", () => {
  // Clone the mock device
  const getMockDevice = () =>
    ({ ...notehubData.successfulNotehubDeviceResponse } as NotehubDevice);

  it("should not produce a location property when none exist", () => {
    const data = notehubDeviceToSparrowGateway(getMockDevice());
    expect(data.location).toBe(undefined);
  });

  it("should choose triangulated location over tower", () => {
    const device = getMockDevice();
    device.tower_location = notehubData.exampleNotehubLocation1;
    device.triangulated_location = notehubData.exampleNotehubLocation2;
    const data = notehubDeviceToSparrowGateway(device);
    expect(data.location).toBe(notehubData.exampleNotehubLocation2.name);
  });

  it("should use tower location if it's the only one available", () => {
    const device = getMockDevice();
    device.tower_location = notehubData.exampleNotehubLocation1;
    const data = notehubDeviceToSparrowGateway(device);
    expect(data.location).toBe(notehubData.exampleNotehubLocation1.name);
  });
});
