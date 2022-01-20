import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import HttpNotehubApiService from "../../../../src/services/notehub/HttpNotehubApiService";
import NotehubDevice from "../../../../src/services/notehub/models/NotehubDevice";

let mock: MockAdapter;
let mockAppBaseUrl: string;
let httpNotehubApiServiceMock: HttpNotehubApiService;

describe("HTTP Notehub API service", () => {
  beforeEach(() => {
    mock = new MockAdapter(axios);
    mockAppBaseUrl = "http://localhost:4000";
    httpNotehubApiServiceMock = new HttpNotehubApiService();
  });

  const mockNotehubDeviceData: NotehubDevice = {
    uid: "dev:1234",
    serial_number: "56789",
    provisioned: "2021-12-31T01:12:00Z",
    last_activity: "2022-01-01T13:28:38Z",
    contact: "Test User",
    product_uid: "net.test:sparrow",
    fleet_uids: [],
    voltage: 2.7,
    temperature: 6,
  };

  it("should return a valid response when a device UID is passed to the getGateway endpoint", async () => {
    const mockUID = "dev:1234";
    mock
      .onGet(`${mockAppBaseUrl}/api/gateways/${mockUID}`)
      .reply(200, mockNotehubDeviceData);

    const res = await httpNotehubApiServiceMock.getGateway(mockUID);
    expect(res).toEqual(mockNotehubDeviceData);
  });
});
