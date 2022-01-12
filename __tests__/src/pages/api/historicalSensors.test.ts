/**
 * @jest-environment node
 */
import { createMocks, RequestMethod } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import historicalSensorsHandler from "../../../../src/pages/api/gateway/[gatewayUID]/historical-sensors";
import { HTTP_STATUS, HTTP_HEADER } from "../../../../src/constants/http";

describe("/api/gateway/[gatewayUID]/historical-sensors API Endpoint", () => {
  const authToken = process.env.HUB_AUTH_TOKEN;
  const gatewayUID = process.env.HUB_DEVICE_UID;

  function mockRequestResponse(method: RequestMethod = "GET") {
    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      createMocks({ method });
    req.headers = {
      [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
      [HTTP_HEADER.SESSION_TOKEN]: authToken,
    };
    req.query = { gatewayUID };
    return { req, res };
  }

  it("GET should return a successful response from Notehub", async () => {
    const { req, res } = mockRequestResponse();
    await historicalSensorsHandler(req, res);
    jest.setTimeout(15000); // added this as the call can be long running due to how far back in time the default date is set to

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({
      "content-type": HTTP_HEADER.CONTENT_TYPE_JSON,
    });
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return a 405 if method is not GET", async () => {
    const { req, res } = mockRequestResponse("POST");
    await historicalSensorsHandler(req, res);

    expect(res.statusCode).toBe(405);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      err: HTTP_STATUS.METHOD_NOT_ALLOWED,
    });
  });

  it("should return a 400 if Gateway UID is not a string", async () => {
    const { req, res } = mockRequestResponse();
    req.query.gatewayUID = 954;
    await historicalSensorsHandler(req, res);

    expect(res.statusCode).toBe(400);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      err: HTTP_STATUS.INVALID_GATEWAY,
    });
  });
});
