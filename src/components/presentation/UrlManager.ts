export interface UrlManager {
  gatewayNameUpdate(gatewayUID: string): string;
  nodeNameUpdate(gatewayUID: string, nodeId: string): string;
  notehubProject(notehubUrl: string, projectUID: string): string;
  bulkDataImport(): string;
  performBulkDataImportApi(): string;

  gatewayDetails(gatewayUID: string): string;
  nodeDetails(gatewayUID: string, nodeId: string): string;
  nodeSummary(gatewayUID: string, nodeId: string): string;
}
