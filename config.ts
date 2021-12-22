const config = {
  appBaseUrl: process.env.APP_BASE_URL,
  hubAppUID: process.env.HUB_APP_UID,
  hubAuthToken: process.env.HUB_AUTH_TOKEN,
  hubBaseURL: process.env.HUB_BASE_URL || "https://api.notefile.net",
  hubDeviceUID: process.env.HUB_DEVICE_UID,
  hubProductUID: process.env.HUB_PRODUCT_UID,
  hubSensorMAC: process.env.HUB_SENSOR_MAC,
};

export default config;
