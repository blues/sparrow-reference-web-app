import Node from "../components/models/Node";

interface GatewayDetailViewModel {
  gateway?: {
    uid: string;
    serialNumber: string;
    lastActivity: string;
    location: string;
    voltage: string;
  };
  nodes?: Node[];
}

export default GatewayDetailViewModel;
