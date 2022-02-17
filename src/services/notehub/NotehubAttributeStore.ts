import { AttributeStore } from "../AttributeStore";
import { NotehubAccessor } from "./NotehubAccessor";

export class NotehubAttributeStore implements AttributeStore {
  constructor(private accessor: NotehubAccessor) {}

  async updateSensorName(gatewayUID: string, macAddress: string, name: string) {
    const { body } = await this.accessor.getConfig(gatewayUID, macAddress);
    body.name = name;
    await this.accessor.setConfig(gatewayUID, macAddress, body);
    return true;
  }

  async updateSensorLocation(
    gatewayUID: string,
    macAddress: string,
    loc: string
  ) {
    const { body } = await this.accessor.getConfig(gatewayUID, macAddress);
    body.loc = loc;
    await this.accessor.setConfig(gatewayUID, macAddress, body);
    return true;
  }
}

const DEFAULT = { NotehubAttributeStore };
export default DEFAULT;
