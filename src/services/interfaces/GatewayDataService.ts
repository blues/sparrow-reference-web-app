import Gateway from "../../components/models/Gateway";

interface GatewayDataService {
  getGateways: (projectUID: string) => Promise<Gateway[]>;
}

// eslint-disable-next-line import/prefer-default-export
export type { GatewayDataService };
