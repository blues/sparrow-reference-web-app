/**
 * @jest-environment node
 */
import { createMocks, RequestMethod } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import environmentVariablesHandler from "../../../../src/pages/api/gateway/[gatewayUID]/environment-variables";
import environmentVariablesDeleteHandler from "../../../../src/pages/api/gateway/[gatewayUID]/environment-variables/[key]";
import { HTTP_STATUS, HTTP_HEADER } from "../../../../src/constants/http";

const authToken = process.env.HUB_AUTH_TOKEN;
const gatewayUIDs = process.env.HUB_DEVICE_UID;
const gatewayUID = gatewayUIDs.split(",")[0];

function mockRequestResponse(method: RequestMethod = "GET") {
  const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
    createMocks({ method });
  req.headers = {
    [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
    [HTTP_HEADER.SESSION_TOKEN]: authToken,
  };
  req.query = { gatewayUID: `${gatewayUID}` };
  return { req, res };
}

describe("/api/gateways/[gatewayUID]/environment-variables GET API Endpoint", () => {
  it("should return a successful response from Notehub", async () => {
    const { req, res } = mockRequestResponse();
    await environmentVariablesHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({
      "content-type": HTTP_HEADER.CONTENT_TYPE_JSON,
    });
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return a 404 if Gateway UID is invalid", async () => {
    const { req, res } = mockRequestResponse();
    req.query = { gatewayUID: "hello world" };

    await environmentVariablesHandler(req, res);

    expect(res.statusCode).toBe(404);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({ err: HTTP_STATUS.NOT_FOUND_GATEWAY });
  });

  it("should return a 400 if Gateway UID is missing", async () => {
    const { req, res } = mockRequestResponse();
    req.query = {}; // Equivalent to a null gatewayUID

    await environmentVariablesHandler(req, res);

    expect(res.statusCode).toBe(400);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      err: HTTP_STATUS.INVALID_GATEWAY,
    });
  });

  it("should return a 405 if HTTP method is not GET or PUT", async () => {
    const { req, res } = mockRequestResponse("POST");

    await environmentVariablesHandler(req, res);
    expect(res.statusCode).toBe(405);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      err: HTTP_STATUS.METHOD_NOT_ALLOWED,
    });
  });
});

describe("/api/gateways/[gatewayUID]/environment-variables PUT API Endpoint", () => {
  it("should successfully update environment variables in Notehub", async () => {
    const { req, res } = mockRequestResponse("PUT");
    req.query.environmentVariables = '{"key1": "value1"}';

    await environmentVariablesHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({
      "content-type": HTTP_HEADER.CONTENT_TYPE_JSON,
    });
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData().environment_variables.key1).toEqual("value1");
    expect(res.statusMessage).toEqual("OK");
  });

  it("should fail with invalid environment variables", async () => {
    const { req, res } = mockRequestResponse("PUT");
    req.query.environmentVariables = "hello world";

    await environmentVariablesHandler(req, res);

    expect(res.statusCode).toBe(500);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      err: HTTP_STATUS.INTERNAL_ERR_ENV_VARS_UPDATE,
    });
  });
});

describe("/api/gateways/[gatewayUID]/environment-variables/[key] DELETE API Endpoint", () => {
  it("should successfully delete environment variables in Notehub", async () => {
    const { req, res } = mockRequestResponse("DELETE");
    req.query.key = "key1";
    await environmentVariablesDeleteHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({
      "content-type": HTTP_HEADER.CONTENT_TYPE_JSON,
    });
    expect(res._getJSONData().environment_variables.key1).toEqual(undefined);
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return a 400 if Gateway UID is missing", async () => {
    const { req, res } = mockRequestResponse("DELETE");
    req.query = { key: "key1" }; // Equivalent to a null gatewayUID

    await environmentVariablesDeleteHandler(req, res);

    expect(res.statusCode).toBe(400);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      err: HTTP_STATUS.INVALID_GATEWAY,
    });
  });

  it("should return a 400 if key is missing", async () => {
    const { req, res } = mockRequestResponse("DELETE");
    req.query = { gatewayUID: "uid" };

    await environmentVariablesDeleteHandler(req, res);

    expect(res.statusCode).toBe(400);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      err: HTTP_STATUS.INVALID_ENV_VAR_KEY,
    });
  });

  it("should return a 405 if HTTP method is not DELETE", async () => {
    const { req, res } = mockRequestResponse("GET");

    await environmentVariablesDeleteHandler(req, res);
    expect(res.statusCode).toBe(405);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      err: HTTP_STATUS.METHOD_NOT_ALLOWED,
    });
  });
});
