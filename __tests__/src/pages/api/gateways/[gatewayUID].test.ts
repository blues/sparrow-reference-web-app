/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import gatewaysHandler from "../../../../../src/pages/api/gateways/[gatewayUID]";

describe("/api/gateways/[gatewayUID] API Endpoint", () => {
  const baseUrl = process.env.HUB_BASE_URL;
  const appUID = process.env.HUB_APP_UID;
  const authToken = process.env.HUB_AUTH_TOKEN;
  const gatewayUID = process.env.HUB_DEVICE_UID;

  const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
    createMocks({
      method: "GET",
    });

  beforeEach(() => {
    req.headers = {
      "Content-Type": "application/json",
      "X-SESSION-TOKEN": authToken,
    };
    req.query = { gatewayUID: `${gatewayUID}` };
  });

  it("should return a successful response from Notehub", async () => {
    await gatewaysHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return a 404 if Gateway UID is invalid", async () => {
    req.query = { gatewayUID: "hello_world" };

    const { res }: { res: NextApiResponse } = createMocks();

    await gatewaysHandler(req, res);

    expect(res.statusCode).toBe(404);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({ err: "Unable to find device" });
  });

  it("should return a 400 if Gateway UID is missing", async () => {
    req.query = { gatewayUID: null };

    const { res }: { res: NextApiResponse } = createMocks();

    await gatewaysHandler(req, res);

    expect(res.statusCode).toBe(400);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      err: "Invalid gateway UID parameter",
    });
  });

  it("should return a 405 if HTTP method is not GET", async () => {
    const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
      createMocks({ method: "POST" });

    await gatewaysHandler(req, res);
    expect(res.statusCode).toBe(405);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      err: "Method not allowed",
    });
  });
});
