// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { ErrorWithCause } from "pony-cause";

import { services } from "../../../../../../services/ServiceLocator";
import { HTTP_STATUS } from "../../../../../../constants/http";

interface ValidRequest {
  gatewayUID: string;
  nodeId: string;
  minutesBeforeNow?: string;
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
  const { gatewayUID, nodeId, minutesBeforeNow } = req.query;
  // Gateway UID must be a string
  if (typeof gatewayUID !== "string") {
    res.status(StatusCodes.BAD_REQUEST);
    res.json({ err: HTTP_STATUS.INVALID_GATEWAY });
    return false;
  }
  if (typeof nodeId !== "string") {
    res.status(StatusCodes.BAD_REQUEST);
    res.json({ err: HTTP_STATUS.INVALID_NODE_ID });
    return false;
  }
  if (minutesBeforeNow && typeof minutesBeforeNow !== "string") {
    res.status(StatusCodes.BAD_REQUEST);
    res.json({
      err: "minutes before now should be a string of numbers or undefined",
    });
    return false;
  }
  return { gatewayUID, nodeId, minutesBeforeNow };
}

async function performRequest({
  gatewayUID,
  nodeId,
  minutesBeforeNow,
}: ValidRequest) {
  const app = services().getAppService();
  try {
    const node = await app.getNodeData(gatewayUID, nodeId, minutesBeforeNow);
    return node;
  } catch (cause) {
    throw new ErrorWithCause("Could not perform request", { cause });
  }
}

export default async function nodeDataHandler(
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
