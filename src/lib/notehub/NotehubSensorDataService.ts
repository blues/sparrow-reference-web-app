export default class NotehubSensorDataSerivce implements SensorDataService {


    api: NotehubAPiService;


    constructor(api: NotehubApiService) {
        this.api = api;
    }

    getGateways(projectUID: string) {
        const resp = this.api.getGateways(projectUID);
        const json = resp.data as NotehubDevice;

        const gateway = {
          lastActivity: json.last_activity,
          location: json.tower_location?.name,
          serialNumber: json.serial_number,
          uid: json.uid,
          voltage: json.voltage,
        };
      
        return [gateway];
    }
    

}