import axios, { AxiosResponse } from "axios";
import Gateway from "../components/models/Gateway";
import { services } from "../services/ServiceLocator";

export async function changeGatewayName(gatewayUID: string, name: string) {
  const endpoint = services().getUrlManager().gatewayNameUpdate(gatewayUID);
  const postBody = { name };
  const response: AxiosResponse = await axios.post(endpoint, postBody);
  return response.status === 200;
}

export async function getGateways() {
  const endpoint = services().getUrlManager().getGateways();
  const response: AxiosResponse = await axios.get(endpoint);
  return response.data as Gateway[];
}

const DEFAULT = { changeGatewayName };
export default DEFAULT;
