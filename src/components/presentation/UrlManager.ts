export interface UrlManager {
  gatewayNameUpdate(gatewayUID: string): string;
  getGateways(): string;
  nodeNameUpdate(gatewayUID: string, nodeId: string): string;
}
