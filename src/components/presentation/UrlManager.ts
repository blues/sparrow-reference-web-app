export interface UrlManager {
  getGateway(gatewayUID: string): string;
  getNodes(gatewayUID: string): string;
  getNode(gatewayUID: string, nodeId: string): string;
  getNodeData(
    gatewayUID: string,
    nodeId: string,
    minutesBeforeNow: string
  ): string;
  nodeNameUpdate(gatewayUID: string, nodeId: string): string;
}
