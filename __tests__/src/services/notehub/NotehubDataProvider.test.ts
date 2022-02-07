import { NotehubAccessor } from "../../../../src/services/notehub/NotehubAccessor";
import NotehubDataProvider, {
  notehubDeviceToSparrowGateway,
} from "../../../../src/services/notehub/NotehubDataProvider";
import sparrowData from "../__serviceMocks__/sparrowData.json"; // mocked data to do with Sparrow portion of app goes here (i.e. gateways and sensors)
import notehubData from "../__serviceMocks__/notehubData.json"; // mocked data to do with Notehub portion of app goes here (i.e. devices and events)
import NotehubDevice from "../../../../src/services/notehub/models/NotehubDevice";
import TemperatureSensorSchema from "../../../../src/components/models/TemperatureSensorSchema";
import HumiditySensorSchema from "../../../../src/components/models/HumiditySensorSchema";
import PressureSensorSchema from "../../../../src/components/models/PressureSensorSchema";
import VoltageSensorSchema from "../../../../src/components/models/VoltageSensorSchema";

describe("Notehub data provider service functions", () => {
  const mockedGatewayJson = notehubData.successfulNotehubDeviceResponse;
  const mockedNotehubLatestEventsJson =
    notehubData.successfulNotehubLatestEventsResponse;
  const mockedNotehubEventsJson = notehubData.successfulNotehubEventResponse;
  const mockedNotehubConfigJson = notehubData.successfulNotehubConfigResponse2;

  let notehubAccessorMock: NotehubAccessor;
  let notehubDataProviderMock: NotehubDataProvider;

  beforeEach(() => {
    notehubAccessorMock = {
      getDevice: jest.fn().mockResolvedValueOnce(mockedGatewayJson),
      getDevices: jest.fn().mockResolvedValueOnce([mockedGatewayJson]),
      getLatestEvents: jest
        .fn()
        .mockResolvedValueOnce(mockedNotehubLatestEventsJson),
      getEvents: jest
        .fn()
        .mockResolvedValueOnce(mockedNotehubEventsJson.events),
      getConfig: jest.fn().mockResolvedValueOnce(mockedNotehubConfigJson),
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

  it("should return sparrow sensor data when a gateway UID and sensor UID is passed to getSensor", async () => {
    const mockedSensorSparrowData =
      sparrowData.successfulSensorSparrowDataResponse;

    const res = await notehubDataProviderMock.getSensor(
      mockedGatewayJson.uid,
      "456789b"
    );
    expect(res).toEqual(mockedSensorSparrowData[1]);
  });

  it("should return a list of sparrow sensor data when a list of gateway UIDs is passed in to getSensors", async () => {
    const mockedSensorSparrowData =
      sparrowData.successfulSensorSparrowDataResponse;

    const res = await notehubDataProviderMock.getSensors([
      mockedGatewayJson.uid,
    ]);
    expect(res).toEqual(mockedSensorSparrowData);
  });

  it("should return a list of sparrow sensor readings when a gateway UID, sensor UID and optional start date is to getSensorData", async () => {
    const res = await notehubDataProviderMock.getSensorData(
      sparrowData.mockedGatewayUID2,
      sparrowData.mockedSensorUID2
    );
    expect(res[0].schema).toEqual(TemperatureSensorSchema);
    expect(res[1].schema).toEqual(HumiditySensorSchema);
    expect(res[2].schema).toEqual(PressureSensorSchema);
    expect(res[3].schema).toEqual(VoltageSensorSchema);
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
