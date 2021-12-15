import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import gatewaysHandler from "../../../src/pages/api/gateways/[gatewayUID]";

let mock;

describe("Testing Alignment Service", () => {
  const gatewayUID = "dev:868050040065365";

  const mockReq = {
    method: "GET",
    query: {
      gatewayUID: "dev:868050040065365",
    },
  };

  const gatewayResponse = {
    status: 200,
    headers: {
      "content-type": "application/JSON",
    },
    body: {
      data: {
        uid: "dev:868050040065365",
      },
    },
  };

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  it("returns a successful response from Notehub", async () => {
    mock.onGet(`/api/gateways/${gatewayUID}`).reply(200, gatewayResponse);
    console.log("res---------", gatewayResponse);
    const response = await gatewaysHandler(mockReq, gatewayResponse);
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("application/JSON");
    expect(response.body).toEqual({});

    // .request("GET", `/api/gateways/${gatewayUID}`)
    // .then((response) => {
    //   // Response is 200 OK
    //   expect(response.status).to.eq(200);
    //   expect(response.headers["content-type"]).to.eq(
    //     "application/json; charset=utf-8"
    //   );
    //   // Smoke test to see if we got good JSON
    //   expect(response.body.uid).to.eq(gatewayUID);
    // });
  });
});
