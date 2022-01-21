import { NotehubAccessor } from "../../../../src/services/notehub/NotehubAccessor";
import NotehubDataProvider, {
  notehubDeviceToSparrowGateway,
} from "../../../../src/services/notehub/NotehubDataProvider";
import sparrowData from "../__serviceMocks__/sparrowData.json"; // mocked data to do with Sparrow portion of app goes here (i.e. gateways and sensors)
import notehubData from "../__serviceMocks__/notehubData.json"; // mocked data to do with Notehub portion of app goes here (i.e. devices and events)
import NotehubDevice from "../../../../src/services/notehub/models/NotehubDevice";
import NotehubLocation from "../../../../src/services/notehub/models/NotehubLocation";

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
  function getMockDevice(): NotehubDevice {
    return {
      uid: "",
      serial_number: "",
      provisioned: "",
      last_activity: "",
      contact: "",
      product_uid: "",
      fleet_uids: [],
      voltage: 0,
      temperature: 0,
    };
  }

  const mockLocation: NotehubLocation = {
    when: "",
    name: "Detroit",
    country: "",
    timezone: "",
    latitude: 0,
    longitude: 0,
  };
  const mockLocation2: NotehubLocation = {
    when: "",
    name: "Atlanta",
    country: "",
    timezone: "",
    latitude: 0,
    longitude: 0,
  };

  it("should not produce a location property when none exist", () => {
    const data = notehubDeviceToSparrowGateway(getMockDevice());
    expect(data.location).toBe(undefined);
  });

  it("should choose triangulated location over tower", () => {
    const device = getMockDevice();
    device.tower_location = mockLocation;
    device.triangulated_location = mockLocation2;
    const data = notehubDeviceToSparrowGateway(device);
    expect(data.location).toBe(mockLocation2.name);
  });

  it("should use tower location if it's the only one available", () => {
    const device = getMockDevice();
    device.tower_location = mockLocation;
    const data = notehubDeviceToSparrowGateway(device);
    expect(data.location).toBe(mockLocation.name);
  });
});
