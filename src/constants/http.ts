// HTTP status constants
const HTTP_STATUS = {
  METHOD_NOT_ALLOWED: "HTTP method not allowed",
  INVALID_GATEWAY: "Invalid Gateway UID",
  INTERNAL_ERR_GATEWAY: "Error while fetching Gateway",
  INTERNAL_ERR_SENSORS: "Error while fetching Sensors",
  NOT_FOUND_GATEWAY: "Unable to locate Gateway",
  NOT_FOUND_SENSORS: "Unable to locate Sensors",
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