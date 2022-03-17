import { UrlManager } from "../../components/presentation/UrlManager";

export const NextJsUrlManager: UrlManager = {
  getGateway: (gatewayUID: string) => `/api/gateway/${gatewayUID}`,
  getNodes: (gatewayUIDs: string[]) => `/api/gateway/${gatewayUID}/node`,
  getNode: (gatewayUID: string, nodeId: string) =>
    `/api/gateway/${gatewayUID}/node/${nodeId}`,
  getNodeData: (gatewayUID: string, nodeId: string, minutesBeforeNow: string) =>
    `/api/gateway/${gatewayUID}/node/${nodeId}/details?minutesBeforeNow=${minutesBeforeNow}`,
  gatewayNameUpdate: (gatewayUID: string) => `/api/gateway/${gatewayUID}/name`,
  nodeNameUpdate: (gatewayUID: string, nodeId: string) =>
    `/api/gateway/${gatewayUID}/node/${nodeId}/config`,
};
const DEFAULT = { NextJsUrlManager };
export default DEFAULT;
