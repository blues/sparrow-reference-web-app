// HTTP status constants
const HTTP_STATUS = {
  METHOD_NOT_ALLOWED: "HTTP method not allowed",
  INVALID_GATEWAY: "Invalid Gateway UID",
  INVALID_SENSOR_MAC: "Invalid Sensor MAC",
  INVALID_CONFIG_BODY: "Invalid Sensor Config Body",
  INTERNAL_ERR_GATEWAY: "Error while fetching Gateway",
  INTERNAL_ERR_SENSORS: "Error while fetching Sensors",
  INTERNAL_ERR_CONFIG: "Error while fetching Sensor Config",
  NOT_FOUND_GATEWAY: "Unable to locate Gateway",
  NOT_FOUND_SENSORS: "Unable to locate Sensors",
  NOT_FOUND_CONFIG: "Unable to locate Sensor config",
};

// HTTP headers
const HTTP_HEADER = {
  CONTENT_TYPE: "Content-Type",
  CONTENT_TYPE_JSON: "application/json",
  SESSION_TOKEN: "X-SESSION-TOKEN"
};

export {
  HTTP_STATUS,
  HTTP_HEADER
};