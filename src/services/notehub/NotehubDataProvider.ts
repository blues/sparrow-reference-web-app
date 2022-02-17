import { flattenDeep } from "lodash";
import Gateway from "../../components/models/Gateway";
import Sensor from "../../components/models/Sensor";
import NotehubDevice from "./models/NotehubDevice";
import { DataProvider } from "../DataProvider";
import { NotehubAccessor } from "./NotehubAccessor";
import NotehubEvent from "./models/NotehubEvent";
import SensorReading from "../../components/models/readings/SensorReading";
import { ERROR_CODES, getError } from "../Errors";
import NotehubLocation from "./models/NotehubLocation";
import TemperatureSensorReading from "../../components/models/readings/TemperatureSensorReading";
import HumiditySensorReading from "../../components/models/readings/HumiditySensorReading";
import PressureSensorReading from "../../components/models/readings/PressureSensorReading";
import VoltageSensorReading from "../../components/models/readings/VoltageSensorReading";
import CountSensorReading from "../../components/models/readings/CountSensorReading";
import TotalSensorReading from "../../components/models/readings/TotalSensorReading";

interface HasNotehubLocation {
  gps_location?: NotehubLocation;
  triangulated_location?: NotehubLocation;
  tower_location?: NotehubLocation;
}

interface HasMacAddress {
  macAddress: string;
}

function getBestLocation(object: HasNotehubLocation) {
  if (object.triangulated_location) {
    return object.triangulated_location;
  }
  if (object.gps_location) {
    return object.gps_location;
  }
  return object.tower_location;
}

export function notehubDeviceToSparrowGateway(device: NotehubDevice) {
  return {
    lastActivity: device.last_activity,
    ...(getBestLocation(device) && {
      location: getBestLocation(device)?.name,
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
        // Convert from Pa to kPa
        pressure: event.body.pressure ? event.body.pressure / 1000 : undefined,
        temperature: event.body.temperature,
        voltage: event.body.voltage,
        total: event.body.total,
        count: event.body.count,
        lastActivity: event.captured,
      }));
      return latestSensorData;
    };

    // If we have more than one gateway to get events for,
    // loop through all the gateway UIDs and collect the events back
    const getAllLatestSensorEvents = async () =>
      Promise.all(gatewayUIDs.map(getLatestSensorDataByGateway));

    const latestSensorEvents = await getAllLatestSensorEvents();
    console.log(latestSensorEvents);

    const simplifiedSensorEvents = flattenDeep(latestSensorEvents).map(
      (sensorEvent) => ({
        name: undefined,
        gatewayUID: sensorEvent.gatewayUID,
        macAddress: sensorEvent.macAddress.split("#")[0],
        humidity: sensorEvent.humidity,
        pressure: sensorEvent.pressure,
        temperature: sensorEvent.temperature,
        voltage: sensorEvent.voltage,
        count: sensorEvent.count,
        total: sensorEvent.total,
        lastActivity: sensorEvent.lastActivity,
      })
    );

    console.log("simplifiedEvents", simplifiedSensorEvents);

    // todo figure out how to merge matching macaddress objects into single objects inside array
    const mergeObject = <V>(A: any, B: any): V => {
      let res:any = {};
      Object.keys({ ...A, ...B }).map((key) => {
        res[key] = B[key] || A[key];
      });
      return res as V;
    };

    const reducer = <V extends HasMacAddress>(groups: Map<string, V>, event: V) => {
      const key = event.macAddress;
      const previous = groups.get(key);
      const merged: V = mergeObject(previous || {}, event);
      groups.set(key, merged);
      return groups;
    };
    const reducedEventsIterator = simplifiedSensorEvents.reduce(reducer, new Map()).values();
    const reducedEvents = Array.from(reducedEventsIterator);
    console.log("reduced events", reducedEvents);

    // get the names and locations of the sensors from the API via config.db
    const getExtraSensorDetails = async (gatewaySensorInfo: Sensor) => {
      const sensorDetailsInfo = await this.notehubAccessor.getConfig(
        gatewaySensorInfo.gatewayUID,
        gatewaySensorInfo.macAddress
      );

      // put it all together in one object
      // todo refactor this into a sanitatization funtion like deleteUndefined or sanitizeSensorData or something
      return {
        macAddress: gatewaySensorInfo.macAddress,
        gatewayUID: gatewaySensorInfo.gatewayUID,
        ...(sensorDetailsInfo?.body?.name && {
          name: sensorDetailsInfo.body.name,
        }),
        ...(sensorDetailsInfo?.body?.loc && {
          location: sensorDetailsInfo.body.loc,
        }),
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
        ...(gatewaySensorInfo.count && {
          count: gatewaySensorInfo.count,
        }),
        ...(gatewaySensorInfo.total && {
          total: gatewaySensorInfo.total,
        }),
      } as Sensor;
    };

    const getAllSensorData = async (gatewaySensorInfo: Sensor[]) =>
      Promise.all(gatewaySensorInfo.map(getExtraSensorDetails));
    const allLatestSensorData = await getAllSensorData(reducedEvents);

    console.log("LATEST SENSOR DATA----------", allLatestSensorData);
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
    const sensorEvents: NotehubEvent[] = await this.notehubAccessor.getEvents(
      options?.startDate
    );

    const filteredEvents: NotehubEvent[] = sensorEvents.filter(
      (event: NotehubEvent) =>
        event.file &&
        event.file.includes(`${sensorUID}`) &&
        (event.file.includes("#air.qo") || event.file.includes("#motion.qo")) &&
        event.device_uid === gatewayUID
    );
    const readingsToReturn: SensorReading<unknown>[] = [];
    filteredEvents.forEach((event: NotehubEvent) => {
      if (event.body.temperature) {
        readingsToReturn.push(
          new TemperatureSensorReading({
            value: event.body.temperature,
            captured: event.captured,
          })
        );
      }
      if (event.body.humidity) {
        readingsToReturn.push(
          new HumiditySensorReading({
            value: event.body.humidity,
            captured: event.captured,
          })
        );
      }
      if (event.body.pressure) {
        readingsToReturn.push(
          new PressureSensorReading({
            // Convert from Pa to kPa
            value: event.body.pressure / 1000,
            captured: event.captured,
          })
        );
      }
      if (event.body.voltage) {
        readingsToReturn.push(
          new VoltageSensorReading({
            value: event.body.voltage,
            captured: event.captured,
          })
        );
      }
      if (event.body.count) {
        readingsToReturn.push(
          new CountSensorReading({
            value: event.body.count,
            captured: event.captured,
          })
        );
      }
      if (event.body.total) {
        readingsToReturn.push(
          new TotalSensorReading({
            value: event.body.total,
            captured: event.captured,
          })
        );
      }
    });

    return readingsToReturn;
  }
}
