// HTTP status constants
const HTTP_STATUS = {
  METHOD_NOT_ALLOWED: "HTTP method not allowed",
  INVALID_GATEWAY: "Invalid Gateway UID",
  INVALID_ENV_VARS: "Invalid environment variables",
  INVALID_ENV_VAR_KEY: "Invalid environment variable key",
  INVALID_SENSOR_MAC: "Invalid Sensor MAC",
  INVALID_CONFIG_BODY: "Invalid Sensor Config Body",
  INVALID_PROJECTUID: "Invalid ProjectUID",

  INTERNAL_ERR_GATEWAY: "Error while fetching Gateway",
  INTERNAL_ERR_SENSORS: "Error while fetching Sensors",
  INTERNAL_ERR_CONFIG: "Error while fetching Sensor Config",
  INTERNAL_ERR_ENV_VARS_FETCH: "Error while fetching environment variables.",
  INTERNAL_ERR_ENV_VARS_UPDATE: "Error while updating environment variables.",
  INTERNAL_ERR_ENV_VARS_DELETE: "Error while deleting an environment variable.",
  NOT_FOUND_GATEWAY: "Unable to locate Gateway",
  NOT_FOUND_SENSORS: "Unable to locate Sensors",
  NOT_FOUND_CONFIG: "Unable to locate Sensor config",
  UNAUTHORIZED: "Unauthorized to access this project",
};

// HTTP headers
const HTTP_HEADER = {
  CONTENT_TYPE: "Content-Type",
  CONTENT_TYPE_JSON: "application/json",
  SESSION_TOKEN: "X-SESSION-TOKEN",
};

export { HTTP_STATUS, HTTP_HEADER };
