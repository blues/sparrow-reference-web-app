// HTTP status constants
const HTTP_STATUS = {
  METHOD_NOT_ALLOWED: "HTTP method not allowed",
  INVALID_GATEWAY: "Invalid Gateway UID",
  INVALID_ENV_VARS: "Invalid environment variables",
  INVALID_ENV_VAR_KEY: "Invalid environment variable key",
  INTERNAL_ERR_GATEWAY: "Error while fetching Gateway",
  INTERNAL_ERR_SENSORS: "Error while fetching Sensors",
  INTERNAL_ERR_ENV_VARS_FETCH: "Error while fetching environment variables.",
  INTERNAL_ERR_ENV_VARS_UPDATE: "Error while updating environment variables.",
  INTERNAL_ERR_ENV_VARS_DELETE: "Error while deleting an environment variable.",
  NOT_FOUND_GATEWAY: "Unable to locate Gateway",
  NOT_FOUND_SENSORS: "Unable to locate Sensors",
  UNAUTHORIZED: "Unauthorized to access this project",
};

// HTTP headers
const HTTP_HEADER = {
  CONTENT_TYPE: "Content-Type",
  CONTENT_TYPE_JSON: "application/json",
  SESSION_TOKEN: "X-SESSION-TOKEN",
};

export { HTTP_STATUS, HTTP_HEADER };
