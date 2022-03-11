/* eslint-disable @typescript-eslint/no-explicit-any */
import { flattenDeep } from "lodash";
import Gateway from "../../components/models/Gateway";
import Node from "../../components/models/Node";
import NotehubDevice from "./models/NotehubDevice";
import { DataProvider } from "../DataProvider";
import { NotehubAccessor } from "./NotehubAccessor";
import NotehubEvent from "./models/NotehubEvent";
import Reading from "../../components/models/readings/Reading";
import { ERROR_CODES, getError } from "../Errors";
import NotehubLocation from "./models/NotehubLocation";
import TemperatureSensorReading from "../../components/models/readings/TemperatureSensorReading";
import HumiditySensorReading from "../../components/models/readings/HumiditySensorReading";
import PressureSensorReading from "../../components/models/readings/PressureSensorReading";
import VoltageSensorReading from "../../components/models/readings/VoltageSensorReading";
import CountSensorReading from "../../components/models/readings/CountSensorReading";
import TotalSensorReading from "../../components/models/readings/TotalSensorReading";
import { getEpochChartDataDate } from "../../components/presentation/uiHelpers";

interface HasNotehubLocation {
  gps_location?: NotehubLocation;
  triangulated_location?: NotehubLocation;
  tower_location?: NotehubLocation;
}

interface HasNodeId {
  nodeId: string;
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
    name: device.serial_number,
    uid: device.uid,
    voltage: device.voltage,
    nodeList: [],
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

  async getNodes(gatewayUIDs: string[]) {
    // get latest node data from API
    const getLatestNodeDataByGateway = async (gatewayUID: string) => {
      const latestNodeEvents = await this.notehubAccessor.getLatestEvents(
        gatewayUID
      );

      // filter out all latest_events that are not `motion.qo` or `air.qo` files - those indicate they are node files
      const filteredNodeData = latestNodeEvents.latest_events.filter(
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

      const latestNodeData = filteredNodeData.map((event) => ({
        gatewayUID,
        nodeId: event.file,
        humidity: event.body.humidity,
        // Convert from Pa to kPa
        pressure: event.body.pressure ? event.body.pressure / 1000 : undefined,
        temperature: event.body.temperature,
        voltage: event.body.voltage,
        total: event.body.total,
        count: event.body.count,
        lastActivity: event.captured,
      }));
      return latestNodeData;
    };

    // If we have more than one gateway to get events for,
    // loop through all the gateway UIDs and collect the events back
    const getAllLatestNodeEvents = async () =>
      Promise.all(gatewayUIDs.map(getLatestNodeDataByGateway));

    const latestNodeEvents = await getAllLatestNodeEvents();

    const simplifiedNodeEvents = flattenDeep(latestNodeEvents).map(
      (nodeEvent) => ({
        name: undefined,
        gatewayUID: nodeEvent.gatewayUID,
        nodeId: nodeEvent.nodeId.split("#")[0],
        humidity: nodeEvent.humidity,
        pressure: nodeEvent.pressure,
        temperature: nodeEvent.temperature,
        voltage: nodeEvent.voltage,
        count: nodeEvent.count,
        total: nodeEvent.total,
        lastActivity: nodeEvent.lastActivity,
      })
    );

    // merge objects with different defined and undefined properties into a single obj
    const mergeObject = <CombinedEventObj>(
      A: any,
      B: any
    ): CombinedEventObj => {
      const res: any = {};
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, array-callback-return, @typescript-eslint/no-unsafe-assignment
      Object.keys({ ...A, ...B }).map((key) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        res[key] = B[key] || A[key];
      });
      return res as CombinedEventObj;
    };

    // merge latest event objects with the same nodeId
    // these are different readings from the same node
    const reducer = <CombinedEventObj extends HasNodeId>(
      groups: Map<string, CombinedEventObj>,
      event: CombinedEventObj
    ) => {
      // make nodeId the map's key
      const key = event.nodeId;
      // fetch previous map values associated with that key
      const previous = groups.get(key);
      // combine the previous map event with new map event
      const merged: CombinedEventObj = mergeObject(previous || {}, event);
      // set the key and newly merged object as the value
      groups.set(key, merged);
      return groups;
    };

    // run the node events through the reducer and then pull only their values into a new Map iterator obj
    const reducedEventsIterator = simplifiedNodeEvents
      .reduce(reducer, new Map())
      .values();

    // transform the Map iterator obj into plain array
    const reducedEvents = Array.from(reducedEventsIterator);

    // get the names and locations of the nodes from the API via config.db
    const getExtraNodeDetails = async (gatewayNodeInfo: Node) => {
      const nodeDetailsInfo = await this.notehubAccessor.getConfig(
        gatewayNodeInfo.gatewayUID,
        gatewayNodeInfo.nodeId
      );

      // put it all together in one object
      return {
        nodeId: gatewayNodeInfo.nodeId,
        gatewayUID: gatewayNodeInfo.gatewayUID,
        ...(nodeDetailsInfo?.body?.name && {
          name: nodeDetailsInfo.body.name,
        }),
        ...(nodeDetailsInfo?.body?.loc && {
          location: nodeDetailsInfo.body.loc,
        }),
        ...(gatewayNodeInfo.voltage && {
          voltage: gatewayNodeInfo.voltage,
        }),
        lastActivity: gatewayNodeInfo.lastActivity,
        ...(gatewayNodeInfo.humidity && {
          humidity: gatewayNodeInfo.humidity,
        }),
        ...(gatewayNodeInfo.pressure && {
          pressure: gatewayNodeInfo.pressure,
        }),
        ...(gatewayNodeInfo.temperature && {
          temperature: gatewayNodeInfo.temperature,
        }),
        ...(gatewayNodeInfo.count && {
          count: gatewayNodeInfo.count,
        }),
        ...(gatewayNodeInfo.total && {
          total: gatewayNodeInfo.total,
        }),
      } as Node;
    };

    const getAllNodeData = async (gatewayNodeInfo: Node[]) =>
      Promise.all(gatewayNodeInfo.map(getExtraNodeDetails));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const allLatestNodeData = await getAllNodeData(reducedEvents);

    return allLatestNodeData;
  }

  async getNode(gatewayUID: string, nodeId: string) {
    const nodes = await this.getNodes([gatewayUID]);
    const match = nodes.filter((node) => node.nodeId === nodeId)[0];
    if (!match) {
      throw getError(ERROR_CODES.NODE_NOT_FOUND);
    }
    return match;
  }

  async getNodeData(
    gatewayUID: string,
    nodeId: string,
    minutesBeforeNow?: string
  ) {
    let nodeEvents: NotehubEvent[];
    if (minutesBeforeNow) {
      const epochDateString: string = getEpochChartDataDate(
        Number(minutesBeforeNow)
      );
      nodeEvents = await this.notehubAccessor.getEvents(epochDateString);
    } else {
      nodeEvents = await this.notehubAccessor.getEvents();
    }

    const filteredEvents: NotehubEvent[] = nodeEvents.filter(
      (event: NotehubEvent) =>
        event.file &&
        event.file.includes(`${nodeId}`) &&
        (event.file.includes("#air.qo") || event.file.includes("#motion.qo")) &&
        event.device_uid === gatewayUID
    );
    const readingsToReturn: Reading<unknown>[] = [];
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
