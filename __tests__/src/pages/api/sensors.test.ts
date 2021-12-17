/**
 * @jest-environment node
 */
import { createMocks, RequestMethod } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import sensorsHandler from "../../../../src/pages/api/gateway/[gatewayUID]/sensors";
import {HTTP_STATUS, HTTP_HEADER} from '../../../../src/constants/http';

describe("/api/gateway/[gatewayUID]/sensors API Endpoint", () => {
  const authToken = process.env.HUB_AUTH_TOKEN;
  const gatewayUID = process.env.HUB_DEVICE_UID;

  function mockRequestResponse (method:RequestMethod="GET") {
    const { req, res }: { req: NextApiRequest; res: NextApiResponse } = createMocks({ method });
    req.headers = {
      [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
      [HTTP_HEADER.SESSION_TOKEN]: authToken,
    };
    req.query = { gatewayUID: `${gatewayUID}` };
    return {req, res};
  }

  it("should return a successful response from Notehub", async () => {
    const {req, res} = mockRequestResponse();
    await sensorsHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({
      'content-type': HTTP_HEADER.CONTENT_TYPE_JSON 
    });
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return a 404 if Gateway UID is invalid", async () => {
    const {req, res} = mockRequestResponse();
    req.query = { gatewayUID: "hello_world" };

    await sensorsHandler(req, res);

    expect(res.statusCode).toBe(404);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({ err: HTTP_STATUS.NOT_FOUND_SENSORS });
  });

  it("should return a 400 if Gateway UID is missing", async () => {
    const {req, res} = mockRequestResponse();
    req.query = {}; // Equivalent to a null gatewayUID

    await sensorsHandler(req, res);

    expect(res.statusCode).toBe(400);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      err: HTTP_STATUS.INVALID_GATEWAY,
    });
  });

  it("should return a 405 if HTTP method is not GET", async () => {
    const {req, res} = mockRequestResponse("POST");

    await sensorsHandler(req, res);
    expect(res.statusCode).toBe(405);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      err: HTTP_STATUS.METHOD_NOT_ALLOWED,
    });
  });
});
