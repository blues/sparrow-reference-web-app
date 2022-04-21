import Node from "../components/models/Node";

interface GatewayDetailViewModel {
  gateway?: {
    uid: string;
    name: string;
    lastActivity: string;
    location: string;
    voltage: string;
    cellBars?: string;
    wifiBars?: string;
  };
  nodes?: Node[];
}

export default GatewayDetailViewModel;
