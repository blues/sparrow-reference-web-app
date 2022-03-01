// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ErrorWithCause } from "pony-cause";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { NextApiRequest, NextApiResponse } from "next";

import { services } from "../../../../../../services/ServiceLocator";
import { HTTP_STATUS } from "../../../../../../constants/http";

interface ValidRequest {
  gatewayUID: string;
  macAddress: string;
  location?: string;
  name?: string;
}

function validateMethod(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(StatusCodes.METHOD_NOT_ALLOWED);
    res.json({ err: `Method ${req.method || "is undefined."} Not Allowed` });
    return false;
  }
  return true;
}
function validateRequest(
  req: NextApiRequest,
  res: NextApiResponse
): false | ValidRequest {
  const { gatewayUID, macAddress } = req.query;
  // TODO (carl): figure out what to do about this unsafe assignment of any. I really want runtime
  // typechecking. All the code below feels terrible to write when we've already specified the API
  // in typescript. Maybe we should really use a different language to specify the API and generate
  // the typescript and typechecking code?
  const { name, location } = req.body;

  if (typeof gatewayUID !== "string") {
    res.status(StatusCodes.BAD_REQUEST);
    res.json({ err: HTTP_STATUS.INVALID_GATEWAY });
    return false;
  }
  if (typeof macAddress !== "string") {
    res.status(StatusCodes.BAD_REQUEST);
    res.json({ err: HTTP_STATUS.INVALID_SENSOR_MAC });
    return false;
  }
  if (typeof location !== "string" && typeof location !== "undefined") {
    res.status(StatusCodes.BAD_REQUEST);
    res.json({ err: "location should be a string or undefined" });
    return false;
  }
  if (typeof name !== "string" && typeof name !== "undefined") {
    res.status(StatusCodes.BAD_REQUEST);
    res.json({ err: "name should be a string or undefined" });
    return false;
  }
  if (typeof location === "undefined" && typeof name === "undefined") {
    res.status(StatusCodes.BAD_REQUEST);
    res.json({ err: HTTP_STATUS.INVALID_SENSOR_CONFIG_BODY });
    return false;
  }

  return { gatewayUID, macAddress, location, name };
}

async function performRequest({
  macAddress,
  gatewayUID,
  location,
  name,
}: ValidRequest) {
  const app = services().getAppService();
  try {
    if (location) await app.setSensorLocation(gatewayUID, macAddress, location);
    if (name) await app.setSensorName(gatewayUID, macAddress, name);
  } catch (cause) {
    throw new ErrorWithCause("Could not perform request", { cause });
  }
}

export default async function sensorConfigHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!validateMethod(req, res)) {
    return;
  }
  const validRequest = validateRequest(req, res);
  if (!validRequest) {
    return;
  }

  try {
    await performRequest(validRequest);
    res.status(StatusCodes.OK).json({});
  } catch (cause) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ err: ReasonPhrases.INTERNAL_SERVER_ERROR });
    const e = new ErrorWithCause("could not handle sensor config", { cause });
    console.error(e);
    throw e;
  }
}
