import {
  PrismaClient,
  Prisma,
  ReadingSource,
  ReadingSchema,
  ReadingSchemaValueType,
  Project,
  Sensor,
  ReadingSourceType,
  Gateway,
  Reading,
} from "@prisma/client";
import GatewayDEPRECATED from "../../components/models/Gateway";
import ReadingDEPRECATED from "../../components/models/readings/Reading";
import NodeDEPRECATED from "../../components/models/Node";

export function gatewayTransformUpsert(
  { uid, name, location, lastActivity }: GatewayDEPRECATED,
  project: Project
): Prisma.GatewayUpsertArgs {
  return {
    where: {
      deviceUID: uid,
    },
    include: {
      readingSource: true,
    },
    create: {
      name,
      deviceUID: uid,
      locationName: location,
      project: {
        connect: {
          id: project.id,
        },
      },
      readingSource: {
        create: {
          type: ReadingSourceType.GATEWAY,
        },
      },
      lastSeenAt: lastActivity,
    },
    update: {
      // No-op. This gateway is already in the database so don't change it.
    },
  };
}

export function nodeTransformUpsert({
  name,
  nodeId,
  location,
  humidity,
  pressure,
  temperature,
  voltage,
  lastActivity,
  count,
  total,
  gatewayUID,
}: NodeDEPRECATED): Prisma.NodeUpsertArgs {
  return {
    where: {
      nodeEUI: nodeId,
    },
    include: {
      readingSource: true,
    },
    create: {
      name,
      nodeEUI: nodeId,
      locationName: location,
      gateway: { connect: { deviceUID: gatewayUID } },

      readingSource: {
        create: {
          type: ReadingSourceType.NODE,
        },
      },
      lastSeenAt: lastActivity,
    },
    update: {
      // No-op. This node is already in the database so don't change it.
    },
  };
}

const DEFAULT = { gatewayTransformUpsert, nodeTransformUpsert };
export default DEFAULT;

// TODO(carl) probably delete this whole file