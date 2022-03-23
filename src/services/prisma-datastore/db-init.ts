import { PrismaClient, Project, Gateway, ReadingSchema, Reading, Prisma, Node, ReadingSource, ReadingSourceType, ReadingSchemaValueType as ReadingSchemaValueType } from '@prisma/client'
import Config from '../../../config'
import { GatewaySensorMeasure, GatewaySensorTypeNames, NodeSensorTypeNames, SensorTypeNames } from '../DomainModel'

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

function referenceSensorName(item: string) {
    return  "Reference Sensor Board "+item;
}

type ReadingSchemaSpec = Prisma.JsonObject & { __primsary?: string };
type ReadingSchemaWitHpec = { spec: ReadingSchemaSpec } & Prisma.InputJsonValue; 

/**
 * Adds defaults for the spec of the reading schema.
 * @param r The ReadingSchema to set up defaults for
 */
const __primary = '__primary';
function readingSchemaDefaults<R extends ReadingSchemaWitHpec>(r: R): R {
    const spec = r.spec;
    if (!spec.__primary) {                  // no existing __primary property
        const keys = Object.keys(spec);
        if (keys.length===1) {
            spec.__primary = keys[0];
        }
    }
    return r;
}

type BareReadingSchema = Prisma.ReadingSchemaCreateWithoutReadingSourceInput & ReadingSchemaWitHpec;
const standardSchemas:BareReadingSchema[] = [
    {
        name: GatewaySensorTypeNames.VOLTAGE,
        measure: GatewaySensorMeasure.VOLTAGE,
        uuid: "a74a2dc4-05a1-4af9-9a63-7dc76abb5637",
        displayName: "Voltage",
        displayMeasure: "Voltage",
        unitSymbol: "V",
        unit: "Voltage",
        eventName: session.qo,
        valueType: ReadingSchemaValueType.SCALAR_FLOAT,   // if type not filled in, it is inferred from the data
        spec: {
            voltage: 1.0
        }
    },
    {
        name: GatewaySensorTypeNames.SIGNAL_STRENGTH,
        measure: GatewaySensorMeasure.SIGNAL_STRENGTH,
        uuid: "8a9aa3c5-da88-4776-bcb8-6f0df2bd3951",
        displayName: "Signal Strength",
        displayMeasure: "Signal Strength",
        unitSymbol: "",
        unit: "bars",
        eventName: session.qo,
        valueType: ReadingSchemaValueType.SCALAR_INT,
        spec: {
            bars: 1
        }
    },
    {
        name: GatewaySensorTypeNames.TEMPERATURE,
        measure: GatewaySensorMeasure.TEMPERATURE,
        uuid: "85315478-194e-4626-913a-684eca6c330e",
        displayName: "Tempearture",
        displayMeasure: "Temperature",
        unitSymbol: "°C",
        unit: "degrees Celcius",
        eventName: session.qo,
        valueType: ReadingSchemaValueType.SCALAR_FLOAT,
        spec: {
            temp: 36.7
        }
    },
    {
        // todo - use an event transformer based on the event name to help sculpture the data coming from notehub
        // to store it in a more useful form. This preceeds creation of the reading.
        name: GatewaySensorTypeNames.LOCATION,
        measure: GatewaySensorMeasure.LOCATION,
        uuid: "89fce756-a7aa-4b81-8848-1ec6797a5fa7",
        displayName: "Location",
        displayMeasure: "Location",
        eventName: session.qo,
        unit: "",
        unitSymbol: "",
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
        name: NodeSensorTypeNames.PIR_MOTION,
        measure: "count",
        uuid: "1824c8b0-2ef2-458b-802c-abd869429af0",
        displayName: referenceSensorName("PIR Motion"),
        displayMeasure: "Motion Count",
        eventName: nodeEvent(motion.qo),
        valueType: ReadingSchemaValueType.SCALAR_INT,
        unit: "",
        unitSymbol: "",
        spec: {
           count: 1,
           total: 1,
           __primary: "count"                                                                   
        }
    },
    {
        name: NodeSensorTypeNames.PIR_MOTION_TOTAL,
        measure: "count",
        uuid: "959464bf-024e-4f68-8e71-64e3416a7d87",
        displayName: referenceSensorName("PIR Total Motion"),
        displayMeasure: "Motion Total Count",
        eventName: nodeEvent(motion.qo),
        valueType: ReadingSchemaValueType.SCALAR_INT,
        unit: "",
        unitSymbol: "",
        spec: {
           count: 1,
           total: 1,
           __primary: "total"                                                                   
        }
    },
    {
        name: NodeSensorTypeNames.TEMPERATURE,
        measure: "temperature",
        uuid: "8cfb013c-ab5f-4f0a-9530-9c56f51e3640",
        displayName: referenceSensorName("Temperature"),
        displayMeasure: "Temperature",
        eventName: nodeEvent(air.qo),
        valueType: ReadingSchemaValueType.SCALAR_FLOAT,
        unitSymbol: "°C",
        unit: "degrees Celcius",
        spec: {
            temperature: 37.6
        }
    },
    {
        name: NodeSensorTypeNames.AIR_PRESSURE,
        measure: "pressure",
        uuid: "6edaf653-12fa-4a43-b585-e4668892c3f5",
        displayName: referenceSensorName("Pressure"),
        displayMeasure: "Pressure",
        eventName: nodeEvent(air.qo),
        unitSymbol: "kPa",
        unit: "kilopascals",
        valueType: ReadingSchemaValueType.SCALAR_FLOAT,
        scale: 100,
        spec: {
            pressure: 10000.1,
        }
    },
    {
        name: NodeSensorTypeNames.HUMIDITY,
        measure: "humidity",
        uuid: "5822e3bf-e152-43df-9ee8-74b18619b4e0",
        displayName: referenceSensorName("Humidity"),
        displayMeasure: "Humidity",
        eventName: nodeEvent(air.qo),
        valueType: ReadingSchemaValueType.SCALAR_FLOAT,
        unit: "Percent",
        unitSymbol: "%",
        spec: {
            humidity: 54.3,
        }
    },
    {
        name: NodeSensorTypeNames.VOLTAGE,
        measure: "voltage",
        uuid: "f85a869d-6be7-4fa4-b007-51a992ff9ecd",
        displayName: referenceSensorName("Voltage"),
        displayMeasure: "Voltage",
        // todo - the node voltage is also reported in the sensors.db which may be the only source for some types of devices
        // ideally source the readings from both types of event 
        eventName: nodeEvent(air.qo),
        valueType: ReadingSchemaValueType.SCALAR_FLOAT,
        unitSymbol: "V",
        unit: "Voltage",
        spec: {
            voltage: 3.3,
        }
    },
    {
        name: NodeSensorTypeNames.LORA_SIGNAL_STRENGTH,
        measure: "rssi_lora",
        uuid: "5c59bd9d-b56e-4faf-bfde-2de836cf39d9",
        displayName: referenceSensorName("RSSI"),
        displayMeasure: "Signal Strength",
        eventName: nodeEvent(sensors.db),
        valueType: ReadingSchemaValueType.SCALAR_INT,
        unitSymbol: "dBm",
        unit: "decibel milliwatts",
        spec: {
            sensor_rssi: 1
        }
    },
    {
        name: GatewaySensorTypeNames.LORA_SIGNAL_STRENGTH,
        measure: "rssi_lora",
        uuid: "591305a3-6b51-4f1f-a2fb-fd685fdc3fdd",
        displayName: GatewaySensorTypeNames.LORA_SIGNAL_STRENGTH,
        displayMeasure: "Signal Strength",
        eventName: nodeEvent(sensors.db),
        valueType: ReadingSchemaValueType.SCALAR_INT,
        unit: "dBm",
        spec: {
            gateway_rssi: 1
        }
    }
];

/**
 * Creates a new project. 
 * @param projectUID 
 */
async function createTypicalProject(prisma: PrismaClient, projectUID: string) {
    const gateways = [
        { 
            deviceUID: 'dev:fake',
            name: 'fake.name',
            location: 'fake.location',
            nodes: [
                {
                    nodeEUI: 'fake.deviceEUI.1',
                    name: 'fake.name.1',
                    location: 'fake.location.1'
                },
                {
                    nodeEUI: 'fake.deviceEUI.2',
                    name: 'fake.name.2',
                    location: 'fake.location.2'
                }
            ]
        }
    ]
   
    const project = await upsertProject({ prisma, projectUID, name: "faker.something" });
    const schemas = standardSchemas.map(readingSchemaDefaults);
    await upsertReadingSchemas(prisma, project.readingSource, schemas);
    await upsertGatewaysAndNodes(prisma, project, gateways);
    return project;
}

type BareGateway = {
    deviceUID: string,
    name: string,
    location: string
}

type BareNode = {
    nodeEUI: string,
    name: string,
    location: string,
}

type BareGatewayAndNodes = BareGateway & {
    nodes?: BareNode[];
}

async function upsertGatewaysAndNodes(prisma: PrismaClient, project: Project, gateways: BareGatewayAndNodes[]) {
    const doall = gateways.map(async gateway => {
        const nodes = gateway.nodes || [];
        delete gateway.nodes;
        const upsertedGateway = await prisma.gateway.upsert({
            where: {
                deviceUID: gateway.deviceUID
            }, 
            update: gateway as BareGateway,
            create: {
                ...gateway,
                readingSource: {
                    create: {
                        type: ReadingSourceType.GATEWAY
                    }
                },
                project: {
                    connect: {
                        id: project.id
                    }
                }
            }
        });
        const upsertedNodes = await upsertNodes(prisma, upsertedGateway, nodes);
    });
    return Promise.all(doall);
}

async function upsertNodes(prisma: PrismaClient, gateway: Gateway, nodes: BareNode[]) {
    const connectGateway = {
        connect: {
            id: gateway.id
        }
    }
    
    const doall = nodes.map(node => {
        return prisma.node.upsert({
            where: {
                nodeEUI: node.nodeEUI
            },
            create: {
                readingSource: {
                    create: {
                        type: ReadingSourceType.NODE
                    }
                },
                gateway: connectGateway,
                ...node
            },
            update: {
                gateway: connectGateway,
                ...node,
            }
        });
    });
    return Promise.all(doall);
}

async function upsertReadingSchemas(prisma: PrismaClient, readingSource: ReadingSource, schemas: BareReadingSchema[]) {
    
    const doall = schemas.map(readingSchema => {
        if (readingSchema.spec===null) {
            throw new Error("spec cannot be null");
        }

        const createAndConnect = Object.assign(readingSchema, {
            readingSource: {
                connect: {
                    id: readingSource.id
                }
            }
        });

        return prisma.readingSchema.upsert({
            where: {
                uuid: readingSchema.uuid
            },
            create: createAndConnect,
            update: createAndConnect
        });
    });
    return Promise.all(doall);
}

async function upsertProject({ prisma, projectUID, name }: { prisma: PrismaClient, projectUID: string, name: string }) {

    const project = await prisma.project.upsert({
        where: {
            projectUID
        } ,  // looks like the typescript info is broken and only supports id
        create: {
            projectUID,
            readingSource: {
                create: {
                    type: ReadingSourceType.PROJECT
                }   
            },
            name
        },
        update: {
            name
        },
        include: {
            readingSource: true,
        }
    });
    return project;    
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