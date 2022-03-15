import Prisma from "@prisma/client"
import * as DomainModel from "../DomainModel";
import IDBuilder from "../IDBuilder";

export interface PrismaDomainModelMapper {
    mapProjectHierarchy(prismaProject: Prisma.Project, gateways: Set<DomainModel.GatewayWithNodes>) : DomainModel.ProjectHierarchy;
    mapProject(data: Prisma.Project):  DomainModel.Project;
    mapGateway(data: Prisma.Gateway):  DomainModel.Gateway;
    mapGatewayWithNodes(data: Prisma.Gateway, nodes: DomainModel.Nodes): DomainModel.GatewayWithNodes;
    mapNode(data: Prisma.Node):  DomainModel.Node;
    mapReadingSchema(data: Prisma.ReadingSchema): DomainModel.SensorType;
    mapReading(data?: Prisma.Reading): DomainModel.Reading;
}

function mapJSONObject(data: Prisma.Prisma.JsonObject) : DomainModel.JSONObject {
    return data;
}


function mapProject (data: Prisma.Project) {
    return {
        id: IDBuilder.buildProjectID(data.projectUID),
        name: data.name,
        description: null
    }
}

function mapProjectHierarchy (data: Prisma.Project, gateways: Set<DomainModel.GatewayWithNodes>) {
    return { ...mapProject(data), gateways }    
}


function mapGateway (data: Prisma.Gateway) {
    return {
        id: IDBuilder.buildGatewayID(data.deviceUID),
        name: data.name,
        lastSeen: data.lastSeenAt,
        descriptionBig: null,
        descriptionSmall: null
    };
}

function mapGatewayWithNodes(data: Prisma.Gateway, nodes: DomainModel.Nodes) {
    return { ...mapGateway(data), nodes }
}

function mapNode(data: Prisma.Node) {
    return {
        id: IDBuilder.buildNodeID(data.nodeEUI),
        name: data.name,
        descriptionSmall: data.label,
        descriptionBig: data.comment,
        lastSeen: data.lastSeenAt
    }
}

function mapReadingSchema(data: Prisma.ReadingSchema) {
    return {
        id: IDBuilder.buildSensorTypeID(data.name),
        name: data.name,
        measure: data.measure,
        displayName: data.displayName || data.name,
        displayMeasure: data.displayMeasure || data.measure,
        spec: data.spec as Prisma.Prisma.JsonObject,
        unitSymbol: data.unit,
        unit: data.unitName
    }
}

// maydo(optimize) - make reading compatible in the db layer for less copying of values.
function mapReading(data: Prisma.Reading) {
    return {
        when: data.when,
        value: data.value as Prisma.Prisma.JsonObject,
        numericValue: data.floatValue || data.intValue
    }
}

const mapper: PrismaDomainModelMapper = {
    mapProject,
    mapProjectHierarchy,
    mapGateway,
    mapGatewayWithNodes,
    mapNode,
    mapReading,
    mapReadingSchema
}

export default mapper;