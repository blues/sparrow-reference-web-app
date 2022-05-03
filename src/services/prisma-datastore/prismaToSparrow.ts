import Prisma from "@prisma/client";
import Gateway from "../alpha-models/Gateway";
import Reading from "../alpha-models/readings/Reading";
import Node from "../alpha-models/Node";

/**
 * Converts a prisma gateway to the old domain model.
 * @param gw
 * @returns
 */
function sparrowGatewayFromPrismaGateway(
  pGateway: Prisma.Gateway,
  voltage: number
): Gateway {
  return {
    uid: pGateway.deviceUID,
    name: pGateway.name || "", // todo - we will be reworking the Gateway/Sensor(Node) models. name should be optional
    location: pGateway.locationName || "",
    lastActivity: pGateway.lastSeenAt?.toDateString() || "", // todo - ideally this is simply cached
    voltage,
    nodeList: [],
  };
}

export { sparrowGatewayFromPrismaGateway };

export const DEFAULT = { sparrowGatewayFromPrismaGateway };
export default DEFAULT;
