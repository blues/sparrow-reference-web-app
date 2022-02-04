import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { SimpleStore } from "../../../../src/services/contextualize";
import { ERROR_CODES } from "../../../../src/services/Errors";
import AxiosHttpNotehubAccessor, { Context } from "../../../../src/services/notehub/AxiosHttpNotehubAccessor";
import NotehubSensorConfig from "../../../../src/services/notehub/models/NotehubSensorConfig";
import notehubData from "../__serviceMocks__/notehubData.json";

let mock: MockAdapter;
const mockBaseURL = "http://blues.io";
const mockAppUID = "app:1234";
const mockDeviceUID = "dev:1234";
const mockProductUID = "test.blues.io";
const API_DEVICE_URL = `${mockBaseURL}/v1/projects/${mockAppUID}/devices/${mockDeviceUID}`;
const API_CONFIG_URL = `${mockBaseURL}/req?product=${mockProductUID}&device=${mockDeviceUID}`;

const context: Context = {
  hubAppUID: mockAppUID,
  hubDeviceUID: mockDeviceUID,
  hubProductUID: mockProductUID,
  hubAuthToken: ""
};

const axiosHttpNotehubAccessorMock = new AxiosHttpNotehubAccessor(mockBaseURL, new SimpleStore(context));

describe("Device handling", () => {
  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  const mockNotehubDeviceData = notehubData.successfulNotehubDeviceResponse;

  it("should return a valid response when a device UID is passed to the getDevice endpoint", async () => {
    mock.onGet(API_DEVICE_URL).reply(200, mockNotehubDeviceData);

    const res = await axiosHttpNotehubAccessorMock.getDevice(mockDeviceUID);
    expect(res).toEqual(mockNotehubDeviceData);
  });

  it("Should give an unauthorized error for 401s", async () => {
    mock.onGet(API_DEVICE_URL).reply(401, mockNotehubDeviceData);

    await expect(
      axiosHttpNotehubAccessorMock.getDevice(mockDeviceUID)
    ).rejects.toThrow(ERROR_CODES.UNAUTHORIZED);
  });

  it("Should give a forbidden error for 403s", async () => {
    mock.onGet(API_DEVICE_URL).reply(403, mockNotehubDeviceData);

    await expect(
      axiosHttpNotehubAccessorMock.getDevice(mockDeviceUID)
    ).rejects.toThrow(ERROR_CODES.FORBIDDEN);
  });

  it("Should give a device-not-found error for 404s", async () => {
    mock.onGet(API_DEVICE_URL).reply(404, mockNotehubDeviceData);

    await expect(
      axiosHttpNotehubAccessorMock.getDevice(mockDeviceUID)
    ).rejects.toThrow(ERROR_CODES.DEVICE_NOT_FOUND);
  });

  it("Should give an internal error error for 500s", async () => {
    mock.onGet(API_DEVICE_URL).reply(500, mockNotehubDeviceData);

    await expect(
      axiosHttpNotehubAccessorMock.getDevice(mockDeviceUID)
    ).rejects.toThrow(ERROR_CODES.INTERNAL_ERROR);
  });

  it("should return a valid response when getting all devices", async () => {
    mock.onGet(API_DEVICE_URL).reply(200, mockNotehubDeviceData);

    const res = await axiosHttpNotehubAccessorMock.getDevices();
    expect(res).toEqual([mockNotehubDeviceData]);
  });
});

describe("Config handling", () => {
  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  const mockNotehubSensorConfig =
    notehubData.successfulNotehubConfigResponse as NotehubSensorConfig;
  const mockMacAddress = mockNotehubSensorConfig.note;

  it("should return valid config", async () => {
    mock.onPost(API_CONFIG_URL).reply(200, mockNotehubSensorConfig);

    const res = await axiosHttpNotehubAccessorMock.getConfig(
      mockDeviceUID,
      mockMacAddress
    );
    expect(res).toEqual(mockNotehubSensorConfig);
  });

  it("should pass through the response (and not throw an error) with a bad config", async () => {
    mock
      .onPost(API_CONFIG_URL)
      .reply(200, notehubData.notehubConfigSensorNotFound);
    const res = await axiosHttpNotehubAccessorMock.getConfig(
      mockDeviceUID,
      mockMacAddress
    );
    expect(res).toEqual(notehubData.notehubConfigSensorNotFound);
  });

  it("should throw a device-not-found error if the device does not exist", async () => {
    mock
      .onPost(API_CONFIG_URL)
      .reply(200, notehubData.notehubConfigDeviceNotFound);
    await expect(
      axiosHttpNotehubAccessorMock.getConfig(mockDeviceUID, mockMacAddress)
    ).rejects.toThrow(ERROR_CODES.DEVICE_NOT_FOUND);
  });

  it("should throw a forbidden error if the API returns insufficient permissions", async () => {
    mock
      .onPost(API_CONFIG_URL)
      .reply(200, notehubData.notehubConfigBadPermissions);
    await expect(
      axiosHttpNotehubAccessorMock.getConfig(mockDeviceUID, mockMacAddress)
    ).rejects.toThrow(ERROR_CODES.FORBIDDEN);
  });

  it("should throw an internal error if the API returns a 500", async () => {
    mock.onPost(API_CONFIG_URL).reply(500, {});

    await expect(
      axiosHttpNotehubAccessorMock.getConfig(mockDeviceUID, mockMacAddress)
    ).rejects.toThrow(ERROR_CODES.INTERNAL_ERROR);
  });
});
