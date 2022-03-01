import { UrlManager } from "../../components/presentation/UrlManager";

export const NextJsUrlManager: UrlManager = {
  sensorNameUpdate: (gatewayUID: string, nodeId: string) =>
    `/api/gateway/${gatewayUID}/sensor/${nodeId}/config`,
};
const DEFAULT = { NextJsUrlManager };
export default DEFAULT;
