import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import NotehubDevice from "../../../../src/services/notehub/models/NotehubDevice";
import { services } from "../../../../src/services/ServiceLocator";

let mock: MockAdapter;

describe("HTTP Notehub API service", () => {
  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  const mockNotehubDevice: NotehubDevice = {
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
    mock
      .onGet("http://localhost:4000/api/gateways/1234")
      .reply(200, mockNotehubDevice);
    const res = await services().getAppService().getGateway("1234");
    expect(res.serialNumber).toBe("56789");
    expect(res.uid).toBe("dev:1234");
    expect(res.voltage).toBe(2.7);
    expect(res.lastActivity).toBe("2022-01-01T13:28:38Z");
  });
});
