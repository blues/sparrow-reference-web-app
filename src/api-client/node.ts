import { useQuery } from "react-query";
import axios, { AxiosResponse } from "axios";
import NodeDetailViewModel from "../models/NodeDetailViewModel";
import Node from "../components/models/Node";
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

export async function getNodes(gatewayUIDs: string[]) {
  const endpoint = services().getUrlManager().getNodes(gatewayUIDs);
  const response: AxiosResponse = await axios.get(endpoint);
  return response.data as Node[];
}

// todo should these custom Hook be in a separate folder of individual Hooks??
export function useNodes(gatewayUIDs: string[]) {
  return useQuery<Node[], Error>("getNodes", () => getNodes(gatewayUIDs), {
    enabled: !!gatewayUIDs,
  });
}

async function getNode(gatewayUID: string, nodeId: string) {
  const endpoint = services().getUrlManager().getNode(gatewayUID, nodeId);
  const response: AxiosResponse = await axios.get(endpoint);
  return response.data as Node;
}

// todo should these custom Hook be in a separate folder of individual Hooks??
export function useNode(
  gatewayUID: string,
  nodeId: string,
  refetchInterval?: number
) {
  return useQuery<Node, Error>("getNode", () => getNode(gatewayUID, nodeId), {
    enabled: !!gatewayUID && !!nodeId,
    refetchInterval,
  });
}

async function getNodeData(
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

// todo should these custom Hook be in a separate folder of individual Hooks??
export function useNodeData(
  gatewayUID: string,
  nodeId: string,
  minutesBeforeNow?: string,
  refetchInterval?: number
) {
  return useQuery<unknown, Error>(
    "getNodeData",
    () => getNodeData(gatewayUID, nodeId, minutesBeforeNow),
    {
      enabled: !!gatewayUID && !!nodeId,
      refetchInterval,
    }
  );
}

const DEFAULT = { changeNodeName, useNode, useNodes, useNodeData };
export default DEFAULT;
