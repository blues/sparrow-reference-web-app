// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosResponse } from "axios";
import { HTTP_STATUS, HTTP_HEADER } from "../../../http";
import config from "../../../../../../config";

export default async function environmentVariablesDeleteHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow DELETE requests
  if (req.method !== "DELETE") {
    res.status(405).json({ err: HTTP_STATUS.METHOD_NOT_ALLOWED });
    return;
  }

  // Query params
  const { gatewayUID, key } = req.query;

  // Gateway UID must be a string
  if (typeof gatewayUID !== "string") {
    res.status(400).json({ err: HTTP_STATUS.INVALID_GATEWAY });
    return;
  }

  // Environment variable key must be a string
  if (typeof key !== "string") {
    res.status(400).json({ err: HTTP_STATUS.INVALID_ENV_VAR_KEY });
    return;
  }

  // Notehub values
  const { hubBaseURL, hubAuthToken, hubProjectUID } = config;
  // API path
  const endpoint = `${hubBaseURL}/v1/projects/${hubProjectUID}/devices/${gatewayUID}/environment_variables/${key}`;
  // API headers
  const headers = {
    [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
    [HTTP_HEADER.SESSION_TOKEN]: hubAuthToken,
  };

  try {
    const response: AxiosResponse = await axios.delete(endpoint, {
      headers,
    });
    // Return JSON
    res.status(200).json(response.data);
  } catch (err) {
    // Check if we got a useful response
    if (axios.isAxiosError(err)) {
      if (err.response && err.response.status === 404) {
        res.status(404).json({ err: HTTP_STATUS.NOT_FOUND_GATEWAY });
        return;
      }

      if (err.response && err.response.status === 403) {
        res.status(403).json({ err: HTTP_STATUS.UNAUTHORIZED });
        return;
      }

      res.status(500).json({ err: HTTP_STATUS.INTERNAL_ERR_ENV_VARS_DELETE });
    } else {
      res.status(500).json({ err: HTTP_STATUS.INTERNAL_ERR_ENV_VARS_DELETE });
    }
  }
}
