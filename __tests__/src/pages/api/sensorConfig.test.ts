/**
 * @jest-environment node
 */
import { createMocks, RequestMethod } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import sensorConfigHandler from "../../../../src/pages/api/gateway/[gatewayUID]/sensor/[macAddress]/config";
import { HTTP_STATUS, HTTP_HEADER } from "../../../../src/constants/http";

describe("/api/gateway/[gatewayUID]/sensor/[macAddress]/config API Endpoint", () => {
  const authToken = process.env.HUB_AUTH_TOKEN;
  const gatewayUID = process.env.HUB_DEVICE_UID;
  const macAddress = process.env.TEST_SENSOR_MAC;

  function mockRequestResponse(method: RequestMethod = "GET") {
    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      createMocks({ method });
    req.headers = {
      [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
      [HTTP_HEADER.SESSION_TOKEN]: authToken,
    };
    req.query = { gatewayUID, macAddress };
    return { req, res };
  }

  it("POST should return a successful response from Notehub", async () => {
    const { req, res } = mockRequestResponse("POST");
    req.body = { location: "TEST_LOCATION", name: "TEST_NAME" };
    await sensorConfigHandler(req, res);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.getHeaders()).toEqual({
      "content-type": HTTP_HEADER.CONTENT_TYPE_JSON,
    });
    expect(res.statusMessage).toEqual("OK");
  });

  it("POST should return a 400 if Sensor config is invalid", async () => {
    const { req, res } = mockRequestResponse("POST");
    req.body = {}; // Equivalent to a null Sensor MAC
    await sensorConfigHandler(req, res);

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.getHeaders()).toEqual({
      "content-type": HTTP_HEADER.CONTENT_TYPE_JSON,
    });
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      err: HTTP_STATUS.INVALID_SENSOR_CONFIG_BODY,
    });
  });

  it("should return a 400 if Gateway UID is not a string", async () => {
    const { req, res } = mockRequestResponse("POST");
    req.query.gatewayUID = 11; // Pass gateway UID of the incorrect type

    await sensorConfigHandler(req, res);

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({ err: HTTP_STATUS.INVALID_GATEWAY });
  });

  it("should return a 405 if method not POST is passed", async () => {
    const { req, res } = mockRequestResponse("PUT");
    req.body = { location: "FAILING_TEST_LOCATION", name: "FAILING_TEST_NAME" };
    await sensorConfigHandler(req, res);

    expect(res.statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({ err: "Method PUT Not Allowed" });
  });
});
