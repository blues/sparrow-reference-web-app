export interface UrlManager {
  getGateway(gatewayUID: string): string;
  getGateways(): string;
  getNodes(gatewayUIDs: string[]): string;
  getNode(gatewayUID: string, nodeId: string): string;
  getNodeData(
    gatewayUID: string,
    nodeId: string,
    minutesBeforeNow: string
  ): string;
  nodeNameUpdate(gatewayUID: string, nodeId: string): string;
}
