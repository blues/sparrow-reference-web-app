import axios, { AxiosResponse } from "axios";
import Gateway from "../components/models/Gateway";
import { services } from "../services/ServiceLocator";

export async function getGateway(gatewayUID: string) {
  const endpoint = services().getUrlManager().getGateway(gatewayUID);
  const response: AxiosResponse = await axios.get(endpoint);
  return response.data as Gateway;
}

const DEFAULT = { getGateway };
export default DEFAULT;
