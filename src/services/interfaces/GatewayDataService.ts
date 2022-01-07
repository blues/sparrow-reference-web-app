import Gateway from "../../models/Gateway";

interface GatewayDataService {
  getGateways: (projectUID: string) => Promise<Gateway[]>;
}

export type { GatewayDataService };
