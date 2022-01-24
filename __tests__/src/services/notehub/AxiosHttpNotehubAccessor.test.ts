import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { ERROR_MESSAGE } from "../../../../src/constants/ui";
import AxiosHttpNotehubAccessor from "../../../../src/services/notehub/AxiosHttpNotehubAccessor";
import notehubData from "../__serviceMocks__/notehubData.json";

let mock: MockAdapter;
const mockDeviceUID = "dev:1234";
let axiosHttpNotehubAccessorMock: AxiosHttpNotehubAccessor;

describe("Gateway handling", () => {
  beforeEach(() => {
    mock = new MockAdapter(axios);

    axiosHttpNotehubAccessorMock = new AxiosHttpNotehubAccessor();
    // "",
    // "",
    // mockDeviceUID,
    // ""
  });

  const mockNotehubDeviceData = notehubData.successfulNotehubDeviceResponse;

  it("should return a valid response when a device UID is passed to the getGateway endpoint", async () => {
    mock
      .onGet(`${axiosHttpNotehubAccessorMock.baseURL}/devices/${mockDeviceUID}`)
      .reply(200, mockNotehubDeviceData);

    const res = await axiosHttpNotehubAccessorMock.getGateway(mockDeviceUID);
    expect(res).toEqual(mockNotehubDeviceData);
  });

  it("Should give an unauthorized error for 401s", async () => {
    mock
      .onGet(`${axiosHttpNotehubAccessorMock.baseURL}/devices/${mockDeviceUID}`)
      .reply(401, mockNotehubDeviceData);

    await expect(
      axiosHttpNotehubAccessorMock.getGateway(mockDeviceUID)
    ).rejects.toThrow(ERROR_MESSAGE.UNAUTHORIZED);
  });

  it("Should give an unauthorized error for 403s", async () => {
    mock
      .onGet(`${axiosHttpNotehubAccessorMock.baseURL}/devices/${mockDeviceUID}`)
      .reply(403, mockNotehubDeviceData);

    await expect(
      axiosHttpNotehubAccessorMock.getGateway(mockDeviceUID)
    ).rejects.toThrow(ERROR_MESSAGE.FORBIDDEN);
  });

  it("Should give an unauthorized error for 404s", async () => {
    mock
      .onGet(`${axiosHttpNotehubAccessorMock.baseURL}/devices/${mockDeviceUID}`)
      .reply(404, mockNotehubDeviceData);

    await expect(
      axiosHttpNotehubAccessorMock.getGateway(mockDeviceUID)
    ).rejects.toThrow(ERROR_MESSAGE.GATEWAY_NOT_FOUND);
  });

  it("Should give an unauthorized error for 500s", async () => {
    mock
      .onGet(`${axiosHttpNotehubAccessorMock.baseURL}/devices/${mockDeviceUID}`)
      .reply(500, mockNotehubDeviceData);

    await expect(
      axiosHttpNotehubAccessorMock.getGateway(mockDeviceUID)
    ).rejects.toThrow(ERROR_MESSAGE.INTERNAL_ERROR);
  });

  it("should return a valid response when getting all gateways", async () => {
    mock
      .onGet(`${axiosHttpNotehubAccessorMock.baseURL}/devices/${mockDeviceUID}`)
      .reply(200, mockNotehubDeviceData);

    const res = await axiosHttpNotehubAccessorMock.getGateways();
    expect(res).toEqual([mockNotehubDeviceData]);
  });
});
