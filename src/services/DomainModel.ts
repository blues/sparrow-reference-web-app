// Do not assume you can reach every gateway, node, sensor, or reading starting
// from an object you're looking at. A QueryFilter is probably in effect which
// has limited the extent to which we have populated objects into memory. For
// example, if you're working with recent data from the 'Black Pearl' node you
// might have info about the Gateway, but just the said node and a few days of
// readings. You'll find `undefined` at the points in the tree that we don't
// care about in the context of an active QueryFilter.

// The convention is that fields that are entirely optional (and may be absent) are 
// marked with ?.  Fields that may have undefined values (e.g. no name set) can also be null.


export interface GatewayID {
  readonly type: "GatewayID";

  /**
   * The natural key for this gateway device, corresponding to the notehub Notecard DeviceUID.
   */
  readonly gatewayDeviceUID: string;
}


export interface NodeID {
  readonly type: "NodeID";

  /**
   * The natural key for this Node device, the Node ID, which is the Deivce EUI
   */
  readonly nodeID: string;
}


export interface SensorTypeID {
  readonly type: "SensorTypeID";
}

export interface ProjectID {
  readonly type: "ProjectID";
  readonly projectUID: string;
}

export interface Project {
  readonly id: ProjectID;

  // Attributes
  name: string;
  description: string | null;
  // Links
}

export type Gateways = Set<Gateway>;

export type ProjectWithGateways = Project & { 
  gateways: Gateways;
}

export type ProjectHierarchy = Project & { 
  gateways: Set<GatewayWithNodes>;
}


export interface SensorHost {
  // Attributes
  name: string | null;
  descriptionBig: string | null;
  descriptionSmall: string | null;
  lastSeen: Date | null;
}

export type Sensors = Set<Sensor>;
export type SensorHostWithSensors = SensorHost & {  
  sensors: Sensors;
}

// todo - doesn't belong here, but in a location dedicated to sensor formats.
// i.e. location is not a property but a sensor reading. 
export interface Location {
  name: string;
  country: string;
}

export interface Gateway extends SensorHost {
  readonly id: GatewayID; // Reference across the whole system architecture
  // Links
}

export type Nodes = Set<Node>;
export type GatewayWithNodes = Gateway & {
  nodes: Nodes;
}


// OLC is a storage format. This doesn't beling here. Instead we should expose the location in meaningful form
// and independent form the on-device format. 
export type LocationOLC = string;
export interface Node extends SensorHost {
  readonly id: NodeID;
  // Attributes
  // locationForMachines: LocationOLC | null;
  // locationForHumans: string | null;
  // Links
  // gateway: Gateway;
}

/**
 * Describes a source of readings, aka a Sensor. All readings are of the same type.
 */
export interface Sensor {
  // Links
  sensorHost: SensorHost;
  sensorType: SensorType;

  // can add other instance-specific details here, e.g. a name field that uniquely identifies the sensor from all others in the project
}

export interface ReadingBySensorType {
  get(s: SensorType) : Reading | undefined;
}

type SensorTypes = Set<SensorType>;

/**
 * Describes a point-in-time slice through the readings for a SensorHost. This represents the last known values at the time given
 */
export interface SensorHostReadingsSnapshot {
  sensorHost: SensorHost;
  sensorTypes: SensorTypes;
  readings: ReadingBySensorType;
}

export interface DateRange {
  from: Date;
  to: Date;
}

/**
 * Shows the most recent data
 */
export interface MostRecent {
  duration: number;   // in minutes
}

export type TimePeriod = DateRange | MostRecent;

export type Readings = Set<Reading>;
export type ReadingsBySensorType = Map<SensorType, Readings>;

/**
 * Describes historical data from a sensor host.
 */
export interface SensorHostReadingsSeries {
  /**
   * The readings from the sensor host in chronological order (oldest first).
   */
  readings: ReadingsBySensorType;
}

export interface SensorType {
  readonly id: SensorTypeID;      // todo - do we really need the ID here? let's add it when it's needed.

  name: string;             // 
  measure: string;          // "measure" expressed as an identifier. 

  // Attributes
  displayName: string;           // Outdoor Temperature, etc. (most specific name) - human readable
  displayMeasure: string;        // Temperature, etc. Used as "class" identifier (general type name) - human readable
  unit: string | null;    // Kelvin, Million, etc.
  unitSymbol: string | null; // K, M, etc. null for no inut

  spec: JSONObject;
  

  // todo - how about including the json schema for the expected value?
  // should we handle simple numeric values as a very common special case?
}

export interface Reading {
  when: Date;

  // Attributes
  value: JSONObject;

  // todo - how do clients know what to do with "value", or what its expected structure is.
  // I added spec to the SensorType

  // The simple numeric value for this sensor for simple numeric readings. This is too common a case for us to ignore and
  // makes handling simple numeric values much easier. (No need to reach into the json on some arbitrary key.)
  numericValue: number | null;

  // Links
  // sensorType: SensorType;   // todo - do we need both sensorType and sensor?
  // sensor: Sensor;
}

export type JSONObject = { [key in string]?: JSONValue };

export type JSONValue =
  | null
  | string
  | number
  | boolean
  | JSONObject
  | Array<JSONValue>;


/**
 * This is the datamodel for displaying the latest values for the whole project.
 */
 type ProjectReadingsShapshot = {

  /**
   * The timestamp of the snapshot. All readings will have been taken on or before the snapshot.
   */
  when: number;

  /**
   * The sensor hierarchy.
   */
  project: ProjectHierarchy;

  /**
   * The readings for each sensor host. 
   * todo - not so happy using a Map here. A higher-level interface would be preferred
   */
  hostReadings: Map<SensorHost, SensorHostReadingsSnapshot>;

  /**
   * Retrieve a reading for a sensor host, with the given name.
   * @param sensorHost  The sensor host the reading is present on.
   * @param readingName The name of the reading to retrieve.
   */
  findSensorReading(sensorHost: SensorHost, readingName: string): Reading;
}

/**
 * Historical data for gateways and nodes.
 **/
type ProjectHistoricalData = {
  period: TimePeriod;
  hostReadings: Map<SensorHost, SensorHostReadingsSeries>; 
}

/**
 * Gateways have a handful of known sensor types. These are enumerated here so that they can be queried for.
 */
export enum GatewaySensorTypes {
    VOLTAGE = "Gateway Voltage",
    SIGNAL_STRENGTH = "Gateway Signal strength",
    TEMPERATURE = "Gateway Temperature",
    LOCATION = "Gateway Location"
}