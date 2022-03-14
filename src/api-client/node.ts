import axios, { AxiosResponse } from "axios";
import NodeDetailViewModel from "../models/NodeDetailViewModel";
import { services } from "../services/ServiceLocator";

export async function changeNodeName(
  gatewayUID: string,
  nodeId: string,
  name: string
) {
  const endpoint = services()
    .getUrlManager()
    .nodeNameUpdate(gatewayUID, nodeId);
  const postBody = { name };
  const response: AxiosResponse = await axios.post(endpoint, postBody);
  return response.status === 200;
}

export async function getNodes(gatewayUID: string) {
  const endpoint = services().getUrlManager().getNodes(gatewayUID);
  const response: AxiosResponse = await axios.get(endpoint);
  return response.data as Node[];
}

export async function getNode(gatewayUID: string, nodeId: string) {
  const endpoint = services().getUrlManager().getNode(gatewayUID, nodeId);
  const response: AxiosResponse = await axios.get(endpoint);
  return response.data as Node;
}

export async function getNodeData(
  gatewayUID: string,
  nodeId: string,
  minutesBeforeNow?: string
) {
  const minutesBeforeNowForServer = minutesBeforeNow || "1440";
  const endpoint = services()
    .getUrlManager()
    .getNodeData(gatewayUID, nodeId, minutesBeforeNowForServer);
  const response: AxiosResponse = await axios.get(endpoint);
  return response.data as NodeDetailViewModel;
}

const DEFAULT = { changeNodeName, getNodes, getNode, getNodeData };
export default DEFAULT;
