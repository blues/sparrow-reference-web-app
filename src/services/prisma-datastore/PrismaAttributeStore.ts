import { PrismaClient } from "@prisma/client";
import { AttributeStore } from "../AttributeStore";


/**
 * This class wraps a store to also populate 
 */
export default class PrismaAttributeStore implements AttributeStore {

    constructor(private prisma: PrismaClient) {}

    // todo - we should probably verify against the project ID?
    async updateGatewayName(gatewayUID: string, name: string): Promise<void> {
        const result = await this.prisma.gateway.update({
            where: {
                deviceUID: gatewayUID
            },
            data: {
                name
            }
        });
    }

    async updateNodeName(gatewayUID: string, nodeId: string, name: string): Promise<void> {
        const result = await this.prisma.node.update({
            where: {
                nodeEUI: nodeId
            },
            data: {
                name
            }
        });
    }
    
    async updateNodeLocation(gatewayUID: string, nodeId: string, location: string): Promise<void> {
        const result = await this.prisma.node.update({
            where: {
                nodeEUI: nodeId
            },
            data: {
                locationName: location
            }
        });
    }

}