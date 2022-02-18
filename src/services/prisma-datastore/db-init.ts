import { PrismaClient, Project, Gateway, DeviceReadingSchema, Reading, Prisma, SparrowDevice } from '@prisma/client'
import { loadEnvConfig } from '@next/env'
import Config from '../../../config'

async function loadEnvironment() {
   const projectDir = process.cwd()
   console.log(projectDir)
   await loadEnvConfig(projectDir)
}

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
// next.js loadEnvironment replaces process.env with a custom object. We don't want that. 
// so just be sure the environment is setup normally. will later use dotenv 
    //    await loadEnvironment();
    await upsertProject();
}

init().catch((e) => {
  throw e
})
.finally(async () => {
  await prisma.$disconnect()
})