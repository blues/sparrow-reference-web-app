// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosResponse } from "axios";
import type NotehubEnvVars from "../../../../services/notehub/models/NotehubEnvVars";
import { HTTP_STATUS, HTTP_HEADER } from "../../../../constants/http";
import config from "../../../../../config";

export default async function environmentVariablesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Gateway UID must be a string
  if (typeof req.query.gatewayUID !== "string") {
    res.status(400).json({ err: HTTP_STATUS.INVALID_GATEWAY });
    return;
  }

  // Query params
  const { gatewayUID, environmentVariables } = req.query;
  // Notehub values
  const { hubBaseURL, hubAuthToken, hubProjectUID } = config;
  // API path
  const endpoint = `${hubBaseURL}/v1/projects/${hubProjectUID}/devices/${gatewayUID}/environment_variables`;
  // API headers
  const headers = {
    [HTTP_HEADER.CONTENT_TYPE]: HTTP_HEADER.CONTENT_TYPE_JSON,
    [HTTP_HEADER.SESSION_TOKEN]: hubAuthToken,
  };

  switch (req.method) {
    case "GET":
      try {
        const response: AxiosResponse = await axios.get(endpoint, { headers });
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
          res
            .status(500)
            .json({ err: HTTP_STATUS.INTERNAL_ERR_ENV_VARS_FETCH });
        } else {
          res
            .status(500)
            .json({ err: HTTP_STATUS.INTERNAL_ERR_ENV_VARS_FETCH });
        }
      }
      break;

    case "PUT":
      if (typeof environmentVariables !== "string") {
        res.status(400).json({ err: HTTP_STATUS.INVALID_ENV_VARS });
        return;
      }

      try {
        const response: AxiosResponse = await axios.put(
          endpoint,
          {
            environment_variables: JSON.parse(
              environmentVariables
            ) as NotehubEnvVars,
          },
          { headers }
        );
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
          res
            .status(500)
            .json({ err: HTTP_STATUS.INTERNAL_ERR_ENV_VARS_UPDATE });
        } else {
          res
            .status(500)
            .json({ err: HTTP_STATUS.INTERNAL_ERR_ENV_VARS_UPDATE });
        }
      }
      break;

    default:
      // Other methods not allowed at this route
      res.status(405).json({ err: HTTP_STATUS.METHOD_NOT_ALLOWED });
      break;
  }
}
