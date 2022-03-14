// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { ErrorWithCause } from "pony-cause";

import { services } from "../../../../services/ServiceLocator";
import { HTTP_STATUS } from "../../../../constants/http";

interface ValidRequest {
  gatewayUID: string;
}

function validateMethod(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
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
  const { gatewayUID } = req.query;
  // Gateway UID must be a string
  if (typeof gatewayUID !== "string") {
    res.status(StatusCodes.BAD_REQUEST);
    res.json({ err: HTTP_STATUS.INVALID_GATEWAY });
    return false;
  }
  return { gatewayUID };
}

async function performRequest({ gatewayUID }: ValidRequest) {
  const app = services().getAppService();
  try {
    const gateway = await app.getGateway(gatewayUID);
    return gateway;
  } catch (cause) {
    throw new ErrorWithCause("Could not perform request", { cause });
  }
}

export default async function gatewayHandler(
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

  const gatewayData = await performRequest(validRequest);
  res.status(StatusCodes.OK).json(gatewayData);
}
