import { UrlManager } from "../../components/presentation/UrlManager";

export const NextJsUrlManager: UrlManager = {
  sensorNameUpdate: (gatewayUID: string, sensorMacAddress: string) =>
    `/api/gateway/${gatewayUID}/sensor/${sensorMacAddress}/config`,
};
const DEFAULT = { NextJsUrlManager };
export default DEFAULT;
