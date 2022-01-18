import Gateway from "../components/models/Gateway";
import { DataProvider } from "./interfaces/DataProvider";

interface AppServiceInterface {
  getGateways: () => Promise<Gateway[]>;
}

export type { AppServiceInterface };

export default class AppService implements AppServiceInterface {
  dataProvider: DataProvider;

  constructor(dataProvider: DataProvider) {
    this.dataProvider = dataProvider;
  }

  async getGateways() {
    return this.dataProvider.getGateways();
  }
}
