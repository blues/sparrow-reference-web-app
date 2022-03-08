import { PrismaClient, Prisma, ReadingSource, ReadingSchema, ReadingSchemaValueType, Project, ReadingSourceType, Gateway, Reading } from "@prisma/client";
import NotehubLocation from "../notehub/models/NotehubLocation";
import { SparrowEvent, SparrowEventHandler } from "../SparrowEvent";


/**
 * The "hidden" property that describes the property that bears the primary data item in the event.
 */
const __primary = "__primary";


export default class PrismaDatastoreEventHandler implements SparrowEventHandler {

    constructor(private prisma: PrismaClient) {

    }

    public async handleEvent(event: SparrowEvent): Promise<void> {
    
        const project = await this.projectFromNaturalKey(event.projectUID);

        const gateway = await this.upsertGateway(project, event.gatewayUID, event.gatewayName, event.when);        
        const node = event.nodeID ? await this.upsertNode(project, gateway, event.nodeID, event.when) : undefined;

        
        // the schema can exist at the node, gateway, project or global level. 
        // todo - add global reading source
        const deviceReadingSources = [ gateway.readingSource, project.readingSource ];
        if (node) {
            deviceReadingSources.push(node.readingSource);
        }
        const deviceReadingSource = node ? node.readingSource : gateway.readingSource;


        // find the schemata that matches the event name and 
        const schemas = await this.prisma.readingSchema.findMany({
            where: {
                eventName: event.eventName, 
                reading_source_id: {
                    in: deviceReadingSources.map(rs => rs.id)
                }
            }
        });

        const promises = schemas.map(s => this.addSchemaReading(deviceReadingSource, s, event.when, event.eventBody as Prisma.InputJsonValue));
        return Promise.all(promises).then((r:Reading[]) => {
            console.log("added readings", r);
        })
    }

    private addSchemaReading(readingSource: ReadingSource, schema: ReadingSchema, when: Date, value: Prisma.InputJsonValue) {
        let intValue = null;
        let floatValue = null;

        const primaryValue = ((schema.spec as any)[__primary]);
        if (primaryValue) {
            switch (schema.valueType) {
                case ReadingSchemaValueType.SCALAR_INT:
                    intValue = ((value as any)[primaryValue]) as number;
                    break;

                case ReadingSchemaValueType.SCALAR_FLOAT:
                    floatValue = ((value as any)[primaryValue]) as number;
                    break;
            }
        }

        return this.prisma.reading.create({
            data: {
                schema_id: schema.id,
                when,
                reading_source_id: readingSource.id,
                value,
                intValue,
                floatValue
            }
        });
    }

    private async findNode(project: Project, deviceUID: string, nodeEUI: string, rejectOnNotFound = true) {
        // todo - filter by project.
        return (await this.prisma.node.findUnique({
            where: {
                nodeEUI
            },
            include: {
                readingSource: true     
            },
            rejectOnNotFound
        }));
    }

    private async findGateway(project: Project, deviceUID: string,  rejectOnNotFound = true) {
        return await this.prisma.gateway.findUnique({
            where: {
                deviceUID
            },
            include: {
                readingSource: true
            },
            rejectOnNotFound
        });
    }


    /**
     * Insert or update the gateway based on the unique device ID.  If the gateway exists but is in a different project,
     * the project is updated. 
     * 
     * @param project 
     * @param deviceUID 
     * @param name 
     * @param lastSeenAt 
     * @param location 
     * @returns 
     */
    private upsertGateway(project: Project, deviceUID: string, name: string, lastSeenAt: Date, location?: NotehubLocation ) {
        return this.prisma.gateway.upsert({
            where: {
                deviceUID
            },
            include: {
                readingSource: true
            },
            create: {
                name,
                deviceUID,
                location: location?.name,
                project: {
                    connect: {
                        id: project.id
                    }
                },
                readingSource: {
                    create: {
                        type: ReadingSourceType.GATEWAY
                    }
                },
                lastSeenAt
            },
            update: {
                name,
                location: location?.name,
                project: {
                    connect: {
                        id: project.id
                    }
                },
                lastSeenAt,
            }
        });
    }

    private upsertNode(project: Project, gateway: Gateway, nodeID: string, lastSeenAt: Date) {
        
        return this.prisma.node.upsert({
            where: {
                nodeEUI: nodeID
            },
            include: {
                readingSource: true
            },
            create: {
                nodeEUI: nodeID,
                gateway: {
                    connect: {
                        id: gateway.id
                    }
                },
                lastSeenAt,
                readingSource: {
                    create: {
                        type: ReadingSourceType.NODE
                    }
                }
            },
            update: {
                gateway: {
                    connect: {
                        id: gateway.id
                    }
                },
                lastSeenAt
            }
        });
    }

    private async projectFromNaturalKey(projectUID: string) {
        const project = await this.prisma.project.findUnique({
            where: {
                projectUID
            },
            include: {
                readingSource: true,
            },
            rejectOnNotFound: true
        });
        return project;
    }
    
}