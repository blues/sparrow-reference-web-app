import axios, { AxiosResponse } from "axios";
import { services } from "../services/ServiceLocator";

export async function changeSensorName(
  gatewayUID: string,
  sensorUID: string,
  name: string
) {
  const endpoint = services()
    .getUrlManager()
    .sensorNameUpdate(gatewayUID, sensorUID);
  const postBody = { name };
  const response: AxiosResponse = await axios.post(endpoint, postBody);
  return response.status === 200;
}

const DEFAULT = { changeSensorName };
export default DEFAULT;
