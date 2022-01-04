// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosResponse } from "axios";
import { HTTP_STATUS, HTTP_HEADER } from "../../../../constants/http";
import NotehubEvent from "../../../../models/NotehubEvent";
import config from "../../../../../config";

export default async function historicalSensorsHandler(
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

  // todo default start date to X days if no other start passed in
  const currentDate = new Date();
  const startDate = Math.round(
    (currentDate.getTime() - 40 * 24 * 60 * 60 * 1000) / 1000
  );
  // Notehub values
  const { hubBaseURL, hubAuthToken, hubAppUID } = config;
  // API path for first event call
  const initialEndpoint = `${hubBaseURL}/v1/projects/${hubAppUID}/events?startDate=${startDate}`;
  // API headers
  const headers = {
    [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
    [HTTP_HEADER.SESSION_TOKEN]: hubAuthToken,
  };

  interface NotehubResponse {
    events: NotehubEvent[];
    has_more: boolean;
    through: string;
  }

  let eventArray: NotehubEvent[] = [];

  // API call
  try {
    const response: AxiosResponse<NotehubResponse> = await axios.get(
      initialEndpoint,
      {
        headers,
      }
    );
    eventArray = response.data.events;
    while (response.data.has_more) {
      // API path for all subsequent event calls
      // console.log("DATA THROUGH ================", response.data.through);
      const recurringEndpoint = `${hubBaseURL}/v1/projects/${hubAppUID}/events?since=${response.data.through}`;
      const newerResponseData: AxiosResponse<NotehubResponse> = await axios.get(
        recurringEndpoint,
        {
          headers,
        }
      );
      eventArray = [...eventArray, ...newerResponseData.data.events];
      if (newerResponseData.data.has_more) {
        response.data.through = newerResponseData.data.through;
      } else {
        response.data.has_more = false;
      }
    }
    // Return JSON
    res.status(200).json(eventArray);
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
