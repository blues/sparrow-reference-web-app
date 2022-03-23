export interface UrlManager {
  gatewayNameUpdate(gatewayUID: string): string;
  nodeNameUpdate(gatewayUID: string, nodeId: string): string;
}
