import axios, { AxiosResponse } from "axios";
import { services } from "../services/ServiceLocator";

export async function changeGatewayName(gatewayUID: string, name: string) {
  const endpoint = services().getUrlManager().gatewayNameUpdate(gatewayUID);
  const postBody = { name };
  const response: AxiosResponse = await axios.post(endpoint, postBody);
  return response.status === 200;
}

const DEFAULT = { changeGatewayName };
export default DEFAULT;
