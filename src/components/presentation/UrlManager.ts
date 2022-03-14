export interface UrlManager {
  getGateway(gatewayUID: string): string;
  getNodes(gatewayUID: string): string;
  nodeNameUpdate(gatewayUID: string, nodeId: string): string;
}
