import Prisma, { PrismaClient, ReadingSource, ReadingSourceType } from "@prisma/client";
import { ErrorWithCause } from "pony-cause";
import GatewayDEPRECATED from "../../components/models/Gateway";
import SensorReading from "../../components/models/readings/SensorReading";
import NodeDEPRECATED from "../../components/models/Node";
import { DataProvider, QueryResult, SimpleFilter, latest } from "../DataProvider";
import { ProjectID, Project, ProjectReadingsSnapshot, SensorHost, SensorHostReadingsSnapshot, SensorType, Reading, SensorHostWithSensors } from "../DomainModel";
import Mapper from "./PrismaDomainModelMapper";

/**
 * Implements the DataProvider service using Prisma ORM.
 */
export class PrismaDataProvider implements DataProvider {
    // todo - passing in the project - this is too restraining and belongs in the app layer.
    // but it's like this for now since the original DataProvider interface doesn't have Project.
    // When the domain model refactor is complete, the projectUID constructor parameter can be removed.
    constructor(
        private prisma: PrismaClient,
        private projectUID: ProjectID)   // todo - remove
    {}

    private async currentProjectID(): Promise<ProjectID> {
        return this.projectUID;
    }

    private async currentProject(): Promise<Prisma.Project> {
        // this is intentionally oversimplified - later will need to consider the current logged in user
        // Project should be included in each method so that this interface is agnostic of the fact that the application
        // works with just one project. 
        const projectID = await this.currentProjectID();
        return this.findProject(projectID);
    }

    private async findProject(projectID: ProjectID) : Promise<Prisma.Project> {
        const project = await this.prisma.project.findFirst({where: {
            projectUID: projectID.projectUID 
        }});
        if (project===null) {
            throw this.error(`Cannot find project with projectUID ${projectID.projectUID}`)
        }
        return project;
    }

    async getGateways(): Promise<GatewayDEPRECATED[]> {
        const project = await this.currentProject();
        const gateways = await this.prisma.gateway.findMany({
            where: {
                project
            }
        });
        
        return gateways.map((gw) => this.sparrowGateway(gw));
    }

    async getGateway(gatewayUID: string): Promise<GatewayDEPRECATED> {
        const project = await this.currentProject();
        const gateway = await this.prisma.gateway.findUnique({
            where: {
                deviceUID: gatewayUID
            }
        });
        if (gateway===null) {
            throw this.error(`Cannot find gateway with DeviceUID ${gatewayUID} in project ${project.projectUID}`);
        }
        return this.sparrowGateway(gateway);
    }

    /**
     * Converts a prisma gateway to the old domain model.
     * @param gw
     * @returns 
     */
    private sparrowGateway(gw: Prisma.Gateway): GatewayDEPRECATED {
        return {
            uid: gw.deviceUID,
            serialNumber: gw.name || '',                        // todo - we will be reworking the Gateway/Sensor(Node) models. name should be optional
            location: gw.location || '',
            lastActivity: gw.lastSeenAt?.toDateString() || '',                  // todo - ideally this is simply cached
            voltage: 3.5,
            nodeList: []
        }
    }

    getNodes(gatewayUIDs: string[]): Promise<NodeDEPRECATED[]> {
        // for now just issue multiple queries. Not sure how useful this method is anyway. 
        return Promise.all(gatewayUIDs.map(gatewayUID => this.getGatewayNodes(gatewayUID))).then(nodes => nodes.flat()); 
    }

    async getGatewayNodes(gatewayUID: string): Promise<NodeDEPRECATED[]> {
        return Promise.resolve([])
    }

    async getNode(gatewayUID: string, sensorUID: string): Promise<NodeDEPRECATED> {
        return Promise.reject();    
    }
    async getNodeData(gatewayUID: string, sensorUID: string, options?: { startDate?: Date | undefined; }): Promise<SensorReading<unknown>[]> {
        return Promise.reject();    
    }

    private retrieveLatestValues({ projectUID } : { projectUID: string }) {
        const latestReading = {             // from the readingSource, fetch all sensors and the latest reading of each.
            include: {
                sensors: {
                    include: {
                        latest: true,
                        schema: true
                    }
                }
            }
        };

        // this retrieves the hiearachy of project/gateway/node with the latest reading for each 
        return this.prisma.project.findUnique({
            where: {
                projectUID
            },
            include: {
                gateways: {
                    include: {
                        readingSource:  latestReading,
                        nodes: {
                            include: {
                                readingSource: latestReading,
                            }
                        }
                    }
                }
            },
            rejectOnNotFound: true
        });
    } 

    async queryProjectLatestValues(projectID: ProjectID): Promise<QueryResult<ProjectID, ProjectReadingsSnapshot>> {

        const prismaProject = await this.retrieveLatestValues(projectID);

        // get the types indirectly so loose coupling
        type P = typeof prismaProject;
        type G = P["gateways"][number];
        type N = G["nodes"][number];
        type RS = G["readingSource"];
        type S = RS["sensors"][number];

        // map the data to the domain model
        const hostReadings = new Map<SensorHost, SensorHostReadingsSnapshot>();

        /**
         * Walks the sensors associated with a ReadingSource, and converts the ReadingSchema and Reading to 
         * SensorType and Reading. 
         * @param rs 
         * @param sensorHost 
         */
        const addReadingSource = (rs: RS, sensorHost: SensorHost) => {

            // one reading per sensor type
            const readings = new Map<SensorType, Reading>();

            const snapshot: SensorHostReadingsSnapshot = {
                sensorHost,
                sensorTypes: new Map(),
                readings
            }

            // maydo - could consider caching the ReadingSchema -> SensorType but it's not that much overhead with duplication per device
            rs.sensors.map(s => {
                if (s.latest) {
                    const sensorType = Mapper.mapReadingSchema(s.schema);
                    const reading =  Mapper.mapReading(s.latest);
                    
                    snapshot.sensorTypes.set(sensorType.name, sensorType);
                    readings.set(sensorType, reading);
                }
            });

            hostReadings.set(sensorHost, snapshot);
        }

        const deepMapNode = (n: N) => {
            const result = Mapper.mapNode(n);
            addReadingSource(n.readingSource, result);            
            return result;
        }

        const deepMapGateway = (g: G) => {
            // map nodes from Prisma to DomainModel
            const nodes = new Set(g.nodes.map(deepMapNode));
            const result = Mapper.mapGatewayWithNodes(g, nodes);
            // add the reading source to provide the set of SensorType and Readings.
            addReadingSource(g.readingSource, result);
            return result;
        };

        // transform Prisma to DomainModel gateways
        const gateways = new Set(prismaProject.gateways.map(deepMapGateway));
        const project = Mapper.mapProjectHierarchy(prismaProject, gateways);

        const results: ProjectReadingsSnapshot = {
            when: Date.now(),
            project,
            hostReadings: (sensorHost: SensorHost) => {
                const reading = hostReadings.get(sensorHost);
                if (reading==undefined) {
                    throw new Error('unknown sensorHost');
                }
                return reading;
            },
            hostReadingByName: (sensorHost: SensorHost, readingName: string) => {
                const snapshot = hostReadings.get(sensorHost);
                const sensorType = snapshot?.sensorTypes.get(readingName);
                return sensorType && snapshot?.readings.get(sensorType);
            }
        };
        
        return { 
            request: projectID, 
            results
        };
    }

    private error<E>(msg: string, cause?: E) {
        if (cause) {
            return new ErrorWithCause(msg, cause);
        }
        else {
            return new Error(msg);
        }
    }
}
