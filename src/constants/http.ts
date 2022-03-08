// HTTP status constants
const HTTP_STATUS = {
  METHOD_NOT_ALLOWED: "HTTP method not allowed",
  INVALID_GATEWAY: "Invalid Gateway UID",
  INVALID_GATEWAY_NAME: "Invalid Gateway name",
  INVALID_NODE_CONFIG_BODY: "Invalid Node Config Body",
  INVALID_NODE_ID: "Invalid Node id",
  INVALID_PROJECTUID: "Invalid ProjectUID",
  INTERNAL_ERR_GATEWAY: "Error while fetching Gateway",
  NOT_FOUND_GATEWAY: "Unable to locate Gateway",
  NOT_FOUND_CONFIG: "Unable to locate Node config",
  UNAUTHORIZED: "Unauthorized to access this project",
};

// HTTP headers
const HTTP_HEADER = {
  CONTENT_TYPE: "Content-Type",
  CONTENT_TYPE_JSON: "application/json",
  SESSION_TOKEN: "X-SESSION-TOKEN",
};

export { HTTP_STATUS, HTTP_HEADER };
