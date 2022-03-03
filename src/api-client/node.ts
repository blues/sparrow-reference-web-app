import axios, { AxiosResponse } from "axios";
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

const DEFAULT = { changeNodeName };
export default DEFAULT;
