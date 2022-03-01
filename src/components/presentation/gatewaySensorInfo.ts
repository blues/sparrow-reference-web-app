import Gateway from "../models/Gateway";
import Node from "../models/Node";

// eslint-disable-next-line import/prefer-default-export
export function getCombinedGatewayNodeInfo(
  latestNodeDataList: Node[],
  gateways: Gateway[]
): Gateway[] {
  const gatewayNodeInfo = gateways.map((gateway) => {
    const filterNodesByGateway = latestNodeDataList.filter(
      (sensor) => sensor.gatewayUID === gateway.uid
    );
    const updatedNodeList = {
      nodeList: filterNodesByGateway,
    };
    const updatedGatewayObject = { ...gateway, ...updatedNodeList };
    return updatedGatewayObject;
  });
  return gatewayNodeInfo;
}
