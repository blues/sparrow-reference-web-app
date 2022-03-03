import { AttributeStore } from "../AttributeStore";
import NoteNodeConfigBody from "./models/NoteNodeConfigBody";
import { NotehubAccessor } from "./NotehubAccessor";

export class NotehubAttributeStore implements AttributeStore {
  constructor(private accessor: NotehubAccessor) {}

  async getNodeConfig(gatewayUID: string, nodeID: string) {
    const defaultConfig = {} as NoteNodeConfigBody;
    const { body } = await this.accessor.getConfig(gatewayUID, nodeID);
    return body || defaultConfig;
  }

  async updateNodeName(gatewayUID: string, nodeId: string, name: string) {
    const config = await this.getNodeConfig(gatewayUID, nodeId);
    config.name = name;
    await this.accessor.setConfig(gatewayUID, nodeId, config);
  }

  async updateNodeLocation(gatewayUID: string, nodeId: string, loc: string) {
    const config = await this.getNodeConfig(gatewayUID, nodeId);
    config.loc = loc;
    await this.accessor.setConfig(gatewayUID, nodeId, config);
  }
}

const DEFAULT = { NotehubAttributeStore };
export default DEFAULT;
