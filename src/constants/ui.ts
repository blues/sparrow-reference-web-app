// Sensor data fallbacks for empty data fields
const SENSOR_MESSAGE = {
  NO_NAME: "No sensor name currently set.",
  NO_VOLTAGE: "No voltage readings currently available.",
  NO_HUMIDITY: "No humidity readings currently available.",
  NO_PRESSURE: "No pressure readings currently available.",
  NO_TEMPERATURE: "No temperature readings currently available.",
};

// Historical sensor data fallbacks for no historical sensor data to display
const HISTORICAL_SENSOR_DATA_MESSAGE = {
  NO_VOLTAGE_HISTORY: "No voltage history currently available.",
  NO_HUMIDITY_HISTORY: "No humidity history currently available.",
  NO_PRESSURE_HISTORY: "No pressure history currently available.",
  NO_TEMPERATURE_HISTORY: "No temperature history currently available.",
};

// Gateway data fallbacks for empty data fields
const GATEWAY_MESSAGE = {
  NO_LOCATION: "No gateway location currently available.",
};

// Error messages when the project fails to display for some reason
const ERROR_MESSAGE = {
  FORBIDDEN:
    "User is unauthorized to access this project. Please contact the Notehub project owner to be invited to the project.",
  GATEWAY_NOT_FOUND:
    "We were unable to locate any gateways. Ensure your HUB_APP_UID and HUB_DEVICE_UID environment variables are configured correctly.",
  INTERNAL_ERROR:
    "An internal error occurred. If this problem persists please contact Blues support.",
  UNAUTHORIZED:
    "Authentication failed. Please ensure you have a valid HUB_AUTH_TOKEN environment variable.",
};

export {
  SENSOR_MESSAGE,
  HISTORICAL_SENSOR_DATA_MESSAGE,
  GATEWAY_MESSAGE,
  ERROR_MESSAGE,
};
