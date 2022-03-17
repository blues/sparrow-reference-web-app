// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { ErrorWithCause } from "pony-cause";

import { services } from "../../../../../services/ServiceLocator";
import { HTTP_STATUS } from "../../../../../constants/http";

interface ValidRequest {
  gatewayUIDArray: string[];
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  let gatewayUIDArray: string[];
  if (typeof gatewayUID === "string") {
    gatewayUIDArray = gatewayUID.split(",");
  } else {
    gatewayUIDArray = gatewayUID;
  }
  // Gateway UID must be a string
  if (typeof gatewayUID !== "string") {
    res.status(StatusCodes.BAD_REQUEST);
    res.json({ err: HTTP_STATUS.INVALID_GATEWAY });
    return false;
  }

  return { gatewayUIDArray };
}

async function performRequest({ gatewayUIDArray }: ValidRequest) {
  const app = services().getAppService();
  try {
    const node = await app.getNodes(gatewayUIDArray);
    return node;
  } catch (cause) {
    throw new ErrorWithCause("Could not perform request", { cause });
  }
}

export default async function nodeHandler(
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

  const nodeData = await performRequest(validRequest);
  res.status(StatusCodes.OK).json(nodeData);
}
