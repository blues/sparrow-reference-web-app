// Sensor data fallbacks for empty data fields
const SENSOR_MESSAGE = {
  NO_NAME: "No sensor name currently set.",
  NO_VOLTAGE: "N/A",
  NO_HUMIDITY: "N/A",
  NO_PRESSURE: "N/A",
  NO_TEMPERATURE: "N/A",
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
  UNAUTHORIZED:
    "User is unauthorized to access this project. Please contact the Notehub project owner to be invited to the project.",
};

export {
  SENSOR_MESSAGE,
  HISTORICAL_SENSOR_DATA_MESSAGE,
  GATEWAY_MESSAGE,
  ERROR_MESSAGE,
};
