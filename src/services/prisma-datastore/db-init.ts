import { PrismaClient, Project, Gateway, DeviceReadingSchema, Reading, Prisma, SparrowDevice } from '@prisma/client'
import { loadEnvConfig } from '@next/env'
import Config from '../../../config'

const prisma = new PrismaClient()

async function upsertProject() {

    const upsert = {
        where: {
            projectUID:  Config.hubProjectUID
        } ,  // looks like the typescript info is broken and only supports id
        create: {
            projectUID:  Config.hubProjectUID,
            name: Config.companyName,
        },
        update: {
            name: Config.companyName
        }
    } as Prisma.ProjectUpsertArgs;
    await prisma.project.upsert(upsert);
}

async function createProject() {

    console.log("Creating project", Config.hubProjectUID)
    await prisma.project.create({
        data: {
            projectUID:  Config.hubProjectUID,
            name: Config.companyName,
        }
    })
}

async function init() {
   await upsertProject();
}

init().catch((e) => {
  throw e
})
.finally(async () => {
  await prisma.$disconnect()
})