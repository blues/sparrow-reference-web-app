import Node from "../components/models/Node";

interface GatewayDetailViewModel {
  gateway?: {
    uid: string;
    name: string;
    lastActivity: string;
    location: string;
    voltage: string;
    cellBars?: string;
    cellBarsIconPath?: string;
    cellBarsTooltip?: string;
    wifiBars?: string;
    wifiBarsIconPath?: string;
    wifiBarsTooltip?: string;
  };
  nodes?: Node[];
}

export default GatewayDetailViewModel;
