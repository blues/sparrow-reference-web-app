export interface UrlManager {
  gatewayDetailsPage(gatewayUID: string): string;
  gatewayNameUpdate(gatewayUID: string): string;
  getGateways(): string;
  nodeNameUpdate(gatewayUID: string, nodeId: string): string;
}
