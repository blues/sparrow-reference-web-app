export interface AttributeStore {
  updateGatewayName: (gatewayUID: string, name: string) => Promise<void>;
  updateNodeName: (
    gatewayUID: string,
    nodeId: string,
    name: string
  ) => Promise<void>;
  updateNodeLocation: (
    gatewayUID: string,
    nodeId: string,
    location: string
  ) => Promise<void>;
}
