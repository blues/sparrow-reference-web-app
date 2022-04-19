import { ERROR_CODES } from "../services/Errors";

// Node data fallbacks for empty data fields
const NODE_MESSAGE = {
  NO_NAME: "(unnamed)",
  NO_LOCATION: "—",
  NEVER_SEEN: "(never)",
};

// Sensor data fallbacks for empty data fields
const SENSOR_MESSAGE = {
  NO_VOLTAGE: "—",
  NO_HUMIDITY: "—",
  NO_PRESSURE: "—",
  NO_TEMPERATURE: "—",
  NO_COUNT: "—",
  NO_TOTAL: "—",
};

// Historical sensor data fallbacks for no historical sensor data to display
const HISTORICAL_SENSOR_DATA_MESSAGE = {
  NO_VOLTAGE_HISTORY: "No voltage history available for selected date range.",
  NO_HUMIDITY_HISTORY: "No humidity history available for selected date range.",
  NO_PRESSURE_HISTORY: "No pressure history available for selected date range.",
  NO_TEMPERATURE_HISTORY:
    "No temperature history available for selected date range.",
  NO_COUNT_HISTORY: "No count history available for selected date range.",
  NO_TOTAL_HISTORY: "No total history available for selected date range.",
};

// Gateway data fallbacks for empty data fields
const GATEWAY_MESSAGE = {
  NO_NAME: "Unknown Gateway.",
  NO_LOCATION: "—",
  NO_VOLTAGE: "—",
  NEVER_SEEN: "(never)",
};

// Error messages when the project fails to display for some reason
const ERROR_MESSAGE = {
  FORBIDDEN:
    "User is unauthorized to access this project. Please contact the Notehub project owner to be invited to the project.",
  GATEWAY_NOT_FOUND:
    "We were unable to locate any gateways. Ensure your environment variables are configured correctly.",
  INTERNAL_ERROR:
    "An internal error occurred. If this problem persists please contact Blues support.",
  UNAUTHORIZED:
    "Authentication failed. Please ensure you have a valid HUB_AUTH_TOKEN environment variable.",
  NODES_NOT_FOUND:
    "We were unable to locate any nodes. Ensure your events are registering in Notehub.",
  GATEWAY_NAME_CHANGE_FAILED: "An error occurred changing the name.",
  DATABASE_NOT_RUNNING:
    "Can't reach the database server. Please make sure your database is properly connected.",
};

const getErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case ERROR_CODES.UNAUTHORIZED:
      return ERROR_MESSAGE.UNAUTHORIZED;
    case ERROR_CODES.FORBIDDEN:
      return ERROR_MESSAGE.FORBIDDEN;
    case ERROR_CODES.DEVICE_NOT_FOUND:
      return ERROR_MESSAGE.GATEWAY_NOT_FOUND;
    case ERROR_CODES.INTERNAL_ERROR:
      return ERROR_MESSAGE.INTERNAL_ERROR;
    case ERROR_CODES.DATABASE_NOT_RUNNING:
      return ERROR_MESSAGE.DATABASE_NOT_RUNNING;
    default:
      // eslint-disable-next-line no-console
      console.error(`Unknown error message code: ${errorCode}`);
      return ERROR_MESSAGE.INTERNAL_ERROR;
  }
};

export {
  NODE_MESSAGE,
  SENSOR_MESSAGE,
  HISTORICAL_SENSOR_DATA_MESSAGE,
  GATEWAY_MESSAGE,
  ERROR_MESSAGE,
  getErrorMessage,
};
