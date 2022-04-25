import Node from "../models/Node";
import Gateway from "../models/Gateway";
import {
  calculateCellSignalStrength,
  calculateSignalTooltip,
  calculateWifiSignalStrength,
  SignalStrengths,
} from "./uiHelpers";

// eslint-disable-next-line import/prefer-default-export
export function getCombinedGatewayNodeInfo(
  latestNodeDataList: Node[],
  gateways: Gateway[]
): Gateway[] {
  const gatewayNodeInfo = gateways.map((gateway) => {
    const filterNodesByGateway = latestNodeDataList.filter(
      (node) => node.gatewayUID === gateway.uid
    );
    const updatedNodeList = {
      nodeList: filterNodesByGateway,
    };
    let gatewaySignalStrengthIconPath: string;
    let gatewaySignalTooltip: string;

    if (gateway.cellBars) {
      gatewaySignalStrengthIconPath = calculateCellSignalStrength(
        gateway.cellBars
      );
      gatewaySignalTooltip = calculateSignalTooltip(gateway.cellBars);

      gateway = {
        ...gateway,
        cellIconPath: gatewaySignalStrengthIconPath,
        cellTooltip: gatewaySignalTooltip,
      };
    } else if (gateway.wifiBars) {
      gatewaySignalStrengthIconPath = calculateWifiSignalStrength(
        gateway.wifiBars
      );
      gatewaySignalTooltip = calculateSignalTooltip(gateway.wifiBars);

      gateway = {
        ...gateway,
        wifiIconPath: gatewaySignalStrengthIconPath,
        wifiTooltip: gatewaySignalTooltip,
      };
    }
    const updatedGatewayObject = {
      ...gateway,
      ...updatedNodeList,
    };
    return updatedGatewayObject;
  });
  return gatewayNodeInfo;
}
