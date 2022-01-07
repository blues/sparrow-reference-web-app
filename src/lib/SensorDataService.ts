import NotehubApiService from "./NotehubApi";

export default interface SensorDataService {

    getGateways(projectUID: string);
}



class MockSensorDataService  {

}

class MongoSensorDataService {

}