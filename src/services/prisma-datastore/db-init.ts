import { PrismaClient, Project, Gateway, ReadingSchema, Reading, Prisma, Node, ReadingSource, ReadingSourceType, ReadingSchemaValueType as ReadingSchemaValueType } from '@prisma/client'
import { hasIn } from 'lodash'
import Config from '../../../config'

const prisma = new PrismaClient()

// project
//   hard-coded sensor schema (don't need so many)
// factory project properties, 
//  factories for gateways
//    factories for nodes (attributes)
//       factories for sensor readings for a set of schema

// default factories, and supplied factories, so individual elements can be overridden
//

// create a default schema. random number of everything
// each mock data has one purpose?

// project: no gateways
 
// from the faker objects, we then run through and populate the project, create gateways in the project,
// in prisma format.  Could have the mocker create the data in prisma format. 
// 


/**
 * Event processing:
 * * normalize event name (this tells us also if it's a node event or not.) based on it matching a <EUI>*event.name
 * * replace EUI with asterisk
 * * 
 * * lookup ReadingSource for gateway or node and the project.
 * find the project by the project UID - could pass this in to the webhook, but how to authenticate? 
 * lookup the project, gateway and node readingSources and use that to find the reading sources with the same event name.
 * look up schema based on the event name using the device readin (there may be many.)
 * 
 * Pull out the data based on the schema (just a for loop and copy). Then create a new Reading for the device, timestamp, schema and payload.
 * We want events by date range, which are indexed (readingSource, )
 * 
 * 
 * @param projectUID 
 * @param userID 
 */

const session = {
    qo: "session.qo"
}

const motion = {
    qo: "motion.qo"
}

const air = {
    qo: "air.qo"
}

const sensors = {
    db: "sensors.db"
}

const _session = {
    db:  "_session.db"
}


function nodeEvent(event: string) {
    return event;
}

function sensorName(item: string) {
    return  "Reference Sensor Board "+item;
}

/**
 * Adds defaults for the spec of the reading schema.
 * @param r The ReadingSchema to set up defaults for
 */
const __primary = '__primary';
function readingSchemaDefaults<R extends { spec: any }>(r: R): R {
    const spec = r.spec;
    if (spec) {
        if (!spec.__primary) {                  // no existing __primary property
            const keys = Object.keys(spec);
            if (keys.length===1) {
                spec.__primary = keys[0];
            }
        }
    }
    return r;
}



const standardSchemas = [
    {
        name: "Gateway Voltage",
        measure: "Voltage",
        unit: "V",
        eventName: session.qo,
        valueType: ReadingSchemaValueType.SCALAR_FLOAT,   // if type not filled in, it is inferred from the data
        spec: {
            voltage: 1.0
        }
    },
    {
        name: "Gateway Signal strength",
        measure: "Signal Strength",
        unit: "bars",
        eventName: session.qo,
        valueType: ReadingSchemaValueType.SCALAR_INT,
        spec: {
            bars: 1
        }
    },
    {
        name: "Gateway Temperature",
        measure: "Temperature",
        unit: "°C",
        eventName: session.qo,
        valueType: ReadingSchemaValueType.SCALAR_FLOAT,
        spec: {
            temp: 36.7
        }
    },
    {
        // todo - use an event transformer based on the event name to help sculpture the data coming from notehub
        // to store it in a more useful form. This preceeds creation of the reading.
        name: "Gateway Location",
        measure: "Location",
        eventName: session.qo,
        valueType: ReadingSchemaValueType.COMPOSITE,
        spec: {
            tri_when: 1644251539,
            tri_lat: 42.76392871,
            tri_lon: -84.64847525,
            tri_location: 'Waverly, MI',
            tri_country: 'US',
            tri_timezone: 'America/Detroit',
            tri_points: 8, 
            __primary: "tri_location"                                                                     
        }
    },
    {
        name: sensorName("PIR Motion"),
        measure: "External Motion",
        eventName: nodeEvent(motion.qo),
        valueType: ReadingSchemaValueType.SCALAR_INT,
        spec: {
           count: 1,
           total: 1,
           __primary: "count"                                                                   
        }
    },
    {
        name: sensorName("Temperature"),
        measure: "Temperature",
        eventName: nodeEvent(air.qo),
        valueType: ReadingSchemaValueType.SCALAR_FLOAT,
        unit: "°C",
        spec: {
            temperature: 37.6
        }
    },
    {
        name: sensorName("Pressure"),
        measure: "Pressure",
        eventName: nodeEvent(air.qo),
        unit: "mmHg",
        valueType: ReadingSchemaValueType.SCALAR_FLOAT,
        scale: 100,
        spec: {
            pressure: 10000.1,
        }
    },
    {
        name: sensorName("Humidity"),
        measure: "Humidity",
        eventName: nodeEvent(air.qo),
        valueType: ReadingSchemaValueType.SCALAR_FLOAT,
        unit: "%",
        spec: {
            humidity: 54.3,
        }
    },
    {
        name: sensorName("Voltage"),
        measure: "Voltage",
        eventName: nodeEvent(air.qo),
        valueType: ReadingSchemaValueType.SCALAR_FLOAT,
        unit: "V",
        spec: {
            voltage: 3.3,
        }
    },
    {
        name: sensorName("RSSI"),
        measure: "Signal Strength",
        eventName: nodeEvent(sensors.db),
        valueType: ReadingSchemaValueType.SCALAR_INT,
        unit: "dBm",
        spec: {
            sensor_rssi: 1
        }
    }
];

/**
 * Creates a new project. 
 * @param projectUID 
 */
async function createTypicalProject(prisma: PrismaClient, projectUID: string) {
    const project = await prisma.project.create({
        data: {
            projectUID,
            name: 'faker.something',
            readingSource: {
                create: {
                    type: ReadingSourceType.PROJECT,
                    readingSchema: {
                         createMany: { data: standardSchemas.map(readingSchemaDefaults) }
                    }
                },
            },
            gateways: {
                create: [
                    { 
                        deviceUID: 'dev:fake',
                        readingSource: {
                            create: {
                                type: ReadingSourceType.GATEWAY
                            }
                        },
                        name: 'fake.name',
                        location: 'fake.location',
                        nodes: {
                            create: [
                                {
                                    readingSource: {
                                        create: {
                                            type: ReadingSourceType.NODE                                            
                                        }
                                    },
                                    nodeEUI: 'fake.deviceEUI.1',
                                    name: 'fake.name',
                                    location: 'fake.location'
                                },
                                {
                                    readingSource: {
                                        create: {
                                            type: ReadingSourceType.NODE                                     
                                        }
                                    },
                                    nodeEUI: 'fake.deviceEUI.2',
                                    name: 'fake.name.2',
                                    location: 'fake.location.2'
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });

    return project;
}




async function upsertProject({ projectUID, userID, name }: { projectUID: string, userID: string, name: string }) {

    const upsert = {
        where: {
            projectUID,
            userID
        } ,  // looks like the typescript info is broken and only supports id
        create: {
            projectUID,
            userID,
            readingSource: {
                create: {
                    type: ReadingSourceType.PROJECT
                }
            },
            name
        },
        update: {
            name
        }
    } as Prisma.ProjectUpsertArgs;
    await prisma.project.upsert(upsert);
}

async function init() {
//   await upsertProject({projectUID: Config.hubProjectUID, userID: Config.hubAuthToken, name: Config.companyName});

  const prisma = new PrismaClient();
  
  createTypicalProject(prisma, Config.hubProjectUID);

}

init().catch((e) => {
  throw e
})
.finally(async () => {
  await prisma.$disconnect()
})