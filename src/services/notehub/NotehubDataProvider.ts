import { flattenDeep, uniqBy } from "lodash";
import Gateway from "../../components/models/Gateway";
import Sensor from "../../components/models/Sensor";
import NotehubDevice from "./models/NotehubDevice";
import { DataProvider } from "../DataProvider";
import { NotehubAccessor } from "./NotehubAccessor";
import NotehubEvent from "./models/NotehubEvent";
import SensorReading from "../../components/models/SensorReading";
import { ERROR_CODES, getError } from "../Errors";

function notehubDeviceToSparrowGateway(device: NotehubDevice) {
  return {
    lastActivity: device.last_activity,
    ...((device?.triangulated_location || device?.tower_location) && {
      location: device?.triangulated_location?.name
        ? device.triangulated_location.name
        : device.tower_location?.name,
    }),
    serialNumber: device.serial_number,
    uid: device.uid,
    voltage: device.voltage,
  };
}

export default class NotehubDataProvider implements DataProvider {
  notehubAccessor: NotehubAccessor;

  constructor(notehubAccessor: NotehubAccessor) {
    this.notehubAccessor = notehubAccessor;
  }

  // eventually this projectUID will need to be passed in - just not yet
  async getGateways() {
    const gateways: Gateway[] = [];
    const rawDevices = await this.notehubAccessor.getDevices();
    rawDevices.forEach((device) => {
      gateways.push(notehubDeviceToSparrowGateway(device));
    });
    return gateways;
  }

  async getGateway(gatewayUID: string) {
    const singleGatewayJson = await this.notehubAccessor.getDevice(gatewayUID);

    const singleGateway = notehubDeviceToSparrowGateway(singleGatewayJson);

    return singleGateway;
  }

  async getSensors(gatewayUIDs: string[]) {
    // get latest sensor data from API
    const getLatestSensorDataByGateway = async (gatewayUID: string) => {
      const latestSensorEvents = await this.notehubAccessor.getLatestEvents(
        gatewayUID
      );

      // filter out all latest_events that are not `motion.qo` or `air.qo` files - those indicate they are sensor files
      const filteredSensorData = latestSensorEvents.latest_events.filter(
        (event: NotehubEvent) => {
          if (
            event.file.includes("#motion.qo") ||
            event.file.includes("#air.qo")
          ) {
            return true;
          }
          return false;
        }
      );

      const latestSensorData = filteredSensorData.map((event) => ({
        gatewayUID,
        macAddress: event.file,
        humidity: event.body.humidity,
        pressure: event.body.pressure,
        temperature: event.body.temperature,
        voltage: event.body.voltage,
        lastActivity: event.captured,
      }));
      return latestSensorData;
    };

    // If we have more than one gateway to get events for,
    // loop through all the gateway UIDs and collect the events back
    const getAllLatestSensorEvents = async () =>
      Promise.all(gatewayUIDs.map(getLatestSensorDataByGateway));

    const latestSensorEvents = await getAllLatestSensorEvents();

    const simplifiedSensorEvents = uniqBy(
      flattenDeep(latestSensorEvents)
        .map((sensorEvent) => ({
          name: undefined,
          gatewayUID: sensorEvent.gatewayUID,
          macAddress: sensorEvent.macAddress.split("#")[0],
          humidity: sensorEvent.humidity,
          pressure: sensorEvent.pressure,
          temperature: sensorEvent.temperature,
          voltage: sensorEvent.voltage,
          lastActivity: sensorEvent.lastActivity,
        }))
        .filter((addr) => addr !== undefined),
      "macAddress"
    );

    // get the names of the sensors from the API via config.db
    const getExtraSensorDetails = async (gatewaySensorInfo: Sensor) => {
      const sensorNameInfo = await this.notehubAccessor.getConfig(
        gatewaySensorInfo.gatewayUID,
        gatewaySensorInfo.macAddress
      );

      // put it all together in one object
      return {
        macAddress: gatewaySensorInfo.macAddress,
        gatewayUID: gatewaySensorInfo.gatewayUID,
        ...(sensorNameInfo?.body?.name && { name: sensorNameInfo.body.name }),
        ...(gatewaySensorInfo.voltage && {
          voltage: gatewaySensorInfo.voltage,
        }),
        lastActivity: gatewaySensorInfo.lastActivity,
        ...(gatewaySensorInfo.humidity && {
          humidity: gatewaySensorInfo.humidity,
        }),
        ...(gatewaySensorInfo.pressure && {
          pressure: gatewaySensorInfo.pressure,
        }),
        ...(gatewaySensorInfo.temperature && {
          temperature: gatewaySensorInfo.temperature,
        }),
      } as Sensor;
    };

    const getAllSensorData = async (gatewaySensorInfo: Sensor[]) =>
      Promise.all(gatewaySensorInfo.map(getExtraSensorDetails));

    const allLatestSensorData = await getAllSensorData(simplifiedSensorEvents);

    return allLatestSensorData;
  }

  async getSensor(gatewayUID: string, sensorUID: string) {
    const sensors = await this.getSensors([gatewayUID]);
    const match = sensors.filter(
      (sensor) => sensor.macAddress === sensorUID
    )[0];
    if (!match) {
      throw getError(ERROR_CODES.SENSOR_NOT_FOUND);
    }
    return match;
  }

  async getSensorData(
    gatewayUID: string,
    sensorUID: string,
    options?: { startDate?: Date }
  ) {
    const sensorEvents = await this.notehubAccessor.getEvents(
      options?.startDate
    );
    const filteredEvents = sensorEvents.filter(
      (event: NotehubEvent) =>
        event.file &&
        event.file.includes(`${sensorUID}`) &&
        event.file.includes("#air.qo") &&
        event.device_uid === gatewayUID
    );
    const readingsToReturn: SensorReading[] = [];
    filteredEvents.forEach((event) => {
      ["humidity", "pressure", "temperature", "voltage"].forEach((key) => {
        readingsToReturn.push({
          key,
          value: event.body[key],
          location: event.tower_location.name,
          captured: event.captured,
        });
      });
    });

    return readingsToReturn;
  }
}
