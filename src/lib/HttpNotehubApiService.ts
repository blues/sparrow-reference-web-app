import NotehubDevice from "./notehub/NotehubDevice";
import NotehubApiService from "./NotehubApi";

export default class HttpNotehubApiService implements NotehubApiService {
    appBaseUrl: string;

    constructor(appBaseUrl) {
        this.appBaseUrl = appBaseUrl;
    }

    async getGateways(deviceUID: string) {
        const resp = await axios.get(
            `${appBaseUrl}/api/gateways/${deviceUID}`
          );
        return resp;
    }

}