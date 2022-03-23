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

export type DomainDate = Date;

export interface SensorHost {
  // Attributes
  name: string | null;
  descriptionBig: string | null;
  descriptionSmall: string | null;
  lastSeen: DomainDate | null;
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

  /**
   * The human-readable location.
   */
  location: string | null;

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

export type SensorTypes = Map<String, SensorType>;

/**
 * Describes a point-in-time slice through the readings for a SensorHost. This represents the last known values at the time given
 */
export interface SensorHostReadingsSnapshot {
  sensorHost: SensorHost;
  sensorTypes: SensorTypes;
  readings: ReadingBySensorType;
}

export interface DateRange {
  from: DomainDate;
  to: DomainDate;
}

export type DurationInMinutes = number;

/**
 * Shows the most recent data
 */
export interface MostRecent {
  duration: DurationInMinutes;
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

  // attributes

  /**
   * A unique name expressed as a javascript identifier for this sensor type in this project.
   */
  name: string;            
  
  /**
   * A class name for this sensor type expressed as a javascript identifier. This is used to categorize sensors 
   * that read the same type of information.
   */
  measure: string;

  /**
   * A presentable name for this type of sensor. For example, "Gateway Location". 
   */
  displayName: string;

  /**
   * A presentable name for the measurement read by this sensor, such as "Temperature".
   */
  displayMeasure: string;        // Temperature, etc. Used as "class" identifier (general type name) - human readable

  /**
   * The name of the unit this type of sensor measures in.
   * E.g. K, C
   * If the unit is dimensionless the unit is the empty string.
   */
  unit: string;            

  /**
   * Symbolic representation of the unit this type of sensor measures in. Can be null if the quantity is dimensionless. 
   * If the unit is dimensionless the unit is the empty string.
  */
  unitSymbol: string; // K, M, etc.

  /**
   * The spec for the type of data produced by each reading.
   */
  spec: JSONValue;
  

  // todo - should we handle simple numeric values as a very common special case?
}

/**
 * Describes a sensor reading. 
 */
export interface Reading {
  /**
   * When the reading was taken by the sensor.
   */
  when: DomainDate;

  /**
   * The value of the sensor reading. 
   */
  value: JSONValue;


  // The simple numeric value for this sensor for simple numeric readings. This is too common a case for us to ignore and
  // makes handling simple numeric values much easier. (No need to reach into the json on some arbitrary key.)
  // todo - make JSONObject a JSONValue so simple numbers can be stored in value.
  numericValue: number | null;

}

export type JSONObject = { [key in string]?: JSONValue };

export type JSONValue =
  | string
  | number
  | boolean
  | JSONObject
  | Array<JSONValue>;

/**
 * This is the model for displaying the latest values for the whole project.
 */
 export type ProjectReadingsSnapshot = {

  /**
   * The timestamp of the snapshot. All readings will have been taken on or before the snapshot.
   */
  readonly when: DomainDate;

  /**
   * The sensor hierarchy.
   */
  readonly project: ProjectHierarchy;

  /**
   * The readings for each sensor host. Each host is provided in the project hierarchy. 
   * If the host does not correspond to one of the sensor hosts in the hierarchy, an exception is thrown.
   */
  hostReadings(sensorHost: SensorHost): SensorHostReadingsSnapshot;

  /**
   * Retrieve a reading for a sensor host, with the given name. This is intended to retrieve the known readings for a given type of sensorHost
   * in contrast to 
   * @param sensorHost  The sensor host the reading is present on.
   * @param readingName The name of the reading to retrieve.
   */
  hostReadingByName(sensorHost: SensorHost, readingName: SensorTypeNames): Reading | undefined;
}

/**
 * Historical data for gateways and nodes.
 **/
export type ProjectHistoricalData = {
  period: TimePeriod;
  hostReadings: Map<SensorHost, SensorHostReadingsSeries>; 
}

/**
 * Gateways and Sensors have a handful of known sensor types.
 * These are enumerated here so that they can be queried for.
 * @see ProjectReadingsSnapshot.hostReadingByName
 */

export const enum GatewaySensorTypeNames {
    VOLTAGE = "gateway_voltage",
    SIGNAL_STRENGTH = "gateway_signal_strength",
    TEMPERATURE = "gateway_temperature",
    LOCATION = "gateway_location",
    LORA_SIGNAL_STRENGTH = "gateway_lora_rssi"
}


export const enum NodeSensorTypeNames {
    VOLTAGE = "node_voltage",
    LORA_SIGNAL_STRENGTH = "node_lora_rssi",
    PIR_MOTION = "pir_motion",
    HUMIDITY = "humidity",
    TEMPERATURE = "temperature",
    AIR_PRESSURE = "air_pressure"
}

export const enum GatewaySensorMeasure {
  VOLTAGE = "voltage",
  SIGNAL_STRENGTH = "bars",
  RSSI = "rssi",
  LOCATION = "location",
  TEMPERATURE = "temperature"
}

export const enum NodeSensorMeasure {
  RSSI = "rssi",
  VOLTAGE = "voltage"
}

export type SensorTypeNames = GatewaySensorTypeNames | NodeSensorTypeNames;