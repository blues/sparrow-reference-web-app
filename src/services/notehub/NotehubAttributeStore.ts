import { AttributeStore } from "../AttributeStore";
import NoteSensorConfigBody from "./models/NoteSensorConfigBody";
import { NotehubAccessor } from "./NotehubAccessor";

export class NotehubAttributeStore implements AttributeStore {
  constructor(private accessor: NotehubAccessor) {}

  async getNodeConfig(gatewayUID: string, nodeID: string) {
    const defaultConfig = {} as NoteSensorConfigBody;
    const { body } = await this.accessor.getConfig(gatewayUID, nodeID);
    return body || defaultConfig;
  }

  async updateSensorName(gatewayUID: string, macAddress: string, name: string) {
    const config = await this.getNodeConfig(gatewayUID, macAddress);
    config.name = name;
    await this.accessor.setConfig(gatewayUID, macAddress, config);
  }

  async updateSensorLocation(
    gatewayUID: string,
    macAddress: string,
    loc: string
  ) {
    const config = await this.getNodeConfig(gatewayUID, macAddress);
    config.loc = loc;
    await this.accessor.setConfig(gatewayUID, macAddress, config);
  }
}

const DEFAULT = { NotehubAttributeStore };
export default DEFAULT;
