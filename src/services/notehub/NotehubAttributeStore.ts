import { AttributeStore } from "../AttributeStore";
import { NotehubAccessor } from "./NotehubAccessor";

export class NotehubAttributeStore implements AttributeStore {
  constructor(private accessor: NotehubAccessor) {}

  async updateNodeName(gatewayUID: string, nodeId: string, name: string) {
    const { body } = await this.accessor.getConfig(gatewayUID, nodeId);
    body.name = name;
    await this.accessor.setConfig(gatewayUID, nodeId, body);
  }

  async updateNodeLocation(gatewayUID: string, nodeId: string, loc: string) {
    const { body } = await this.accessor.getConfig(gatewayUID, nodeId);
    body.loc = loc;
    await this.accessor.setConfig(gatewayUID, nodeId, body);
  }
}

const DEFAULT = { NotehubAttributeStore };
export default DEFAULT;
