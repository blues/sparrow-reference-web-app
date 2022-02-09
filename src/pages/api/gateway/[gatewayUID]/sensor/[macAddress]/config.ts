// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosResponse } from "axios";
import { HTTP_STATUS, HTTP_HEADER } from "../../../../../../constants/http";
import config from "../../../../../../../config";
import type NotehubErr from "../../../../../../services/notehub/models/NotehubErr";
import type NoteSensorConfigBody from "../../../../../../services/notehub/models/NoteSensorConfigBody";

export default async function sensorConfigHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Gateway UID must be a string
  if (typeof req.query.gatewayUID !== "string") {
    res.status(400).json({ err: HTTP_STATUS.INVALID_GATEWAY });
    return;
  }
  // Sensor MAC must be a string
  if (typeof req.query.macAddress !== "string") {
    res.status(400).json({ err: HTTP_STATUS.INVALID_SENSOR_MAC });
    return;
  }

  // Query params
  const { gatewayUID, macAddress } = req.query;
  // Body params
  const { loc, name } = req.body as NoteSensorConfigBody;
  // Notehub values
  const { hubBaseURL, hubAuthToken, hubProjectUID } = config;
  // API path
  const endpoint = `${hubBaseURL}/req?project=${hubProjectUID}&device=${gatewayUID}`;
  // API headers
  const headers = {
    [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
    [HTTP_HEADER.SESSION_TOKEN]: hubAuthToken,
  };

  // note.update payload
  const noteUpdate = {
    req: "note.update",
    file: "config.db",
    note: macAddress,
    body: {
      loc,
      name,
    },
  };

  // Costruct body based on HTTP method
  let postBody;
  switch (req.method) {
    case "POST":
      // Check config body params
      if (loc === undefined || name === undefined) {
        res.status(400).json({ err: HTTP_STATUS.INVALID_CONFIG_BODY });
        return;
      }
      postBody = noteUpdate;
      break;
    default:
      // Other methods not allowed at this route
      res.status(405).json({ err: HTTP_STATUS.METHOD_NOT_ALLOWED });
      return;
  }

  try {
    // API call
    const response: AxiosResponse = await axios.post(endpoint, postBody, {
      headers,
    });
    // This call responds with a 200/OK even if the note was 404/NotFound.
    // But it will contain an err property we can watch out for.
    if ("err" in response.data) {
      // Assert error type
      const { err } = response.data as NotehubErr;
      // Check the error message
      if (err.includes("note-noexist")) {
        // Return 204 error (request succeeded, but nothing to see here)
        res.status(204).end();
        return;
      }
      if (err.includes("insufficient permissions")) {
        res.status(403).json({ err: HTTP_STATUS.UNAUTHORIZED });
        return;
      }
    } else {
      // Return JSON
      res.status(200).json(response.data);
      return;
    }
  } catch (err) {
    // Return 500 error
    res.status(500).json({ err: HTTP_STATUS.INTERNAL_ERR_CONFIG });
  }
}
