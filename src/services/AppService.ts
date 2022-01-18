import Gateway from "../components/models/Gateway";
import { DataProvider } from "./interfaces/DataProvider";

// this class / interface combo passes data and functions to the service locator file
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
