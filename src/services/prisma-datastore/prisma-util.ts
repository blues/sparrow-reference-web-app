/* eslint-disable import/prefer-default-export */
import { PrismaClient } from "@prisma/client";

// From https://github.com/vercel/next.js/issues/7811#issuecomment-618425485
// Prevent Next.js from using creating multiple Prisma connections
// during development.
export function getPrismaClient(databaseURL: string): PrismaClient {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: { db: { url: databaseURL } },
    });
  }
  return global.prisma;
}
