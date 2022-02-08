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
      getDevice: jest.fn().mockResolvedValueOnce(mockedGatewayJson),
      getDevices: jest.fn().mockResolvedValueOnce([mockedGatewayJson]),
      getLatestEvents: jest.fn().mockResolvedValueOnce({}),
      getEvents: jest.fn().mockResolvedValueOnce([]),
      getConfig: jest.fn().mockResolvedValueOnce({}),
    };
    notehubDataProviderMock = new NotehubDataProvider(notehubAccessorMock);
  });

  it("should convert a Notehub device to a Sparrow gateway", async () => {
    const mockedGatewaysSparrowData =
      sparrowData.successfulGatewaySparrowDataResponse;
    const res = await notehubDataProviderMock.getGateway(mockedGatewayJson.uid);
    expect(res).toEqual(mockedGatewaysSparrowData);
  });

  it("should return a list sparrow gateway instances when getGateways is called", async () => {
    const mockedGatewaysSparrowData = [
      sparrowData.successfulGatewaySparrowDataResponse,
    ];

    const res = await notehubDataProviderMock.getGateways();
    expect(res).toEqual(mockedGatewaysSparrowData);
  });
});

describe("Location handling", () => {
  const getMockDevice = () =>
    ({ ...notehubData.successfulNotehubDeviceResponse } as NotehubDevice);

  it("should not produce a location property when none exist", () => {
    const mockDevice = getMockDevice();
    const res = notehubDeviceToSparrowGateway(mockDevice);
    expect(res.location).toBe(undefined);
  });

  it("should choose triangulated location over tower", () => {
    const mockDevice = getMockDevice();
    mockDevice.tower_location = notehubData.exampleNotehubLocation1;
    mockDevice.triangulated_location = notehubData.exampleNotehubLocation2;
    const res = notehubDeviceToSparrowGateway(mockDevice);
    expect(res.location).toBe(mockDevice.triangulated_location.name);
  });

  it("should use tower location if it's the only one available", () => {
    const mockDevice = getMockDevice();
    mockDevice.tower_location = notehubData.exampleNotehubLocation1;
    const res = notehubDeviceToSparrowGateway(mockDevice);
    expect(res.location).toBe(mockDevice.tower_location.name);
  });
});
