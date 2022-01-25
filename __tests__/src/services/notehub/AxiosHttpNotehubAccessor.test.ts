import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import AxiosHttpNotehubAccessor from "../../../../src/services/notehub/AxiosHttpNotehubAccessor";
import notehubData from "../__serviceMocks__/notehubData.json";

let mock: MockAdapter;
let mockAppBaseUrl: string;
let axiosHttpNotehubAccessorMock: AxiosHttpNotehubAccessor;

describe.skip("HTTP Notehub API service", () => {
  beforeEach(() => {
    mock = new MockAdapter(axios);
    mockAppBaseUrl = "http://localhost:4000";
    axiosHttpNotehubAccessorMock = new AxiosHttpNotehubAccessor();
  });

  const mockNotehubDeviceData = notehubData.successfulNotehubDeviceResponse;

  it("should return a valid response when a device UID is passed to the getGateway endpoint", async () => {
    const mockUID = "dev:1234";
    mock
      .onGet(`${mockAppBaseUrl}/api/gateways/${mockUID}`)
      .reply(200, mockNotehubDeviceData);

    const res = await axiosHttpNotehubAccessorMock.getGateway(mockUID);
    expect(res).toEqual(mockNotehubDeviceData);
  });
});
