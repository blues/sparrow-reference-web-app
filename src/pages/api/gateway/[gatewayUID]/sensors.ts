// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosResponse } from "axios";
import { HTTP_STATUS, HTTP_HEADER } from "../../../../constants/http";
import config from "../../../../../config";

export default async function sensorsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    res.status(405).json({ err: HTTP_STATUS.METHOD_NOT_ALLOWED });
    return;
  }

  // Gateway UID must be a string
  if (typeof req.query.gatewayUID !== "string") {
    res.status(400).json({ err: HTTP_STATUS.INVALID_GATEWAY });
    return;
  }

  // Query params
  const { gatewayUID } = req.query;
  // Notehub values
  const { hubBaseURL, hubAuthToken, hubAppUID } = config;
  // API path
  const endpoint = `${hubBaseURL}/v1/projects/${hubAppUID}/devices/${gatewayUID}/latest`;
  // API headers
  const headers = {
    [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
    [HTTP_HEADER.SESSION_TOKEN]: hubAuthToken,
  };

  // API call
  try {
    const response: AxiosResponse = await axios.get(endpoint, { headers });
    // Return JSON
    res.status(200).json(response.data);
  } catch (err) {
    // Check if we got a useful response
    if (axios.isAxiosError(err)) {
      if (err.response && err.response.status === 404) {
        // Return 404 error
        res.status(404).json({ err: HTTP_STATUS.NOT_FOUND_SENSORS });
      }
    } else {
      // Return 500 error
      res.status(500).json({ err: HTTP_STATUS.INTERNAL_ERR_SENSORS });
    }
  }
}
