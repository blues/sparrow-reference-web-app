import { UrlManager } from "../../components/presentation/UrlManager";

export const NextJsUrlManager: UrlManager = {
  gatewayNameUpdate: (gatewayUID: string) => `/api/gateway/${gatewayUID}/name`,
  getGateways: () => `/api/gateways`,
  nodeNameUpdate: (gatewayUID: string, nodeId: string) =>
    `/api/gateway/${gatewayUID}/node/${nodeId}/config`,
};
const DEFAULT = { NextJsUrlManager };
export default DEFAULT;
