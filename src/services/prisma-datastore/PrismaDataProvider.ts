import { PrismaClient, Project as PrismaProject, Gateway as PrismaGateway } from "@prisma/client";
import { ErrorWithCause } from "pony-cause";
import Gateway from "../../components/models/Gateway";
import SensorReading from "../../components/models/readings/SensorReading";
import Node from "../../components/models/Node";
import { DataProvider } from "../DataProvider";

/**
 * Implements the DataProvider service using a Prisma data model.
 */
export class PrismaDataProvider implements DataProvider {
    
    constructor(
        private prisma: PrismaClient, 
        private projectUID: string)
    {}

    private async currentProjectUID(): Promise<string> {
        return this.projectUID;
    }

    private async currentProject(): Promise<PrismaProject> {
        // this is intentionally oversimplified - later will need to consider the current logged in user
        const projectUID = await this.currentProjectUID();
        const project = await this.prisma.project.findFirst({where: {
            projectUID 
        }});
        if (project===null) {
            throw this.error(`Cannot find project with projectUID ${projectUID}`)
        }
        return project;
    }

    async getGateways(): Promise<Gateway[]> {
        const project = await this.currentProject();
        const gateways = await this.prisma.gateway.findMany({
            where: {
                project
            }
        });
        
        return gateways.map((gw) => this.sparrowGateway(gw));
    }

    async getGateway(gatewayUID: string): Promise<Gateway> {
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


    private sparrowGateway(gw: PrismaGateway): Gateway {
        return {
            uid: gw.deviceUID,
            serialNumber: gw.name || '',                        // todo - we will be reworking the Gateway/Sensor(Node) models. name should be optional
            location: gw.location || '',
            lastActivity: gw.lastSeenAt?.toDateString() || '',                  // todo - ideally this is simply cached
            voltage: 3.5,
            nodeList: []
        }
    }

    getNodes(gatewayUIDs: string[]): Promise<Node[]> {
        // for now just issue multiple queries. Not sure how useful this method is anyway. 
        return Promise.all(gatewayUIDs.map(gatewayUID => this.getGatewayNodes(gatewayUID))).then(nodes => nodes.flat()); 
    }

    async getGatewayNodes(gatewayUID: string): Promise<Node[]> {
        return Promise.resolve([])
    }

    async getNode(gatewayUID: string, sensorUID: string): Promise<Node> {
        return Promise.reject();    
    }
    async getNodeData(gatewayUID: string, sensorUID: string, options?: { startDate?: Date | undefined; }): Promise<SensorReading<unknown>[]> {
        return Promise.reject();    
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