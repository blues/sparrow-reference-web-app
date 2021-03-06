import { AttributeStore } from "../AttributeStore";

// would be nice to generify this and implement as a generic proxy
export default class CompositeAttributeStore implements AttributeStore {
  constructor(private stores: AttributeStore[]) {}

  // Retrieves a promise that is resolved when all delegates have completed
  private apply(fn: (store: AttributeStore) => Promise<void>): Promise<void> {
    const all = this.stores.map((store) => fn(store));
    return Promise.all(all).then();
  }

  updateGatewayName(gatewayUID: string, name: string): Promise<void> {
    return this.apply((store) => store.updateGatewayName(gatewayUID, name));
  }

  updateNodeName(
    gatewayUID: string,
    nodeId: string,
    name: string
  ): Promise<void> {
    return this.apply((store) =>
      store.updateNodeName(gatewayUID, nodeId, name)
    );
  }

  updateNodeLocation(
    gatewayUID: string,
    nodeId: string,
    location: string
  ): Promise<void> {
    return this.apply((store) =>
      store.updateNodeLocation(gatewayUID, nodeId, location)
    );
  }
}
