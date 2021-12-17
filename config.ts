const config = {
  hubBaseURL: process.env.HUB_BASE_URL || "https://api.notefile.net",
  hubAuthToken: process.env.HUB_AUTH_TOKEN,
  hubAppUID: process.env.HUB_APP_UID,
  hubDeviceUID: process.env.HUB_DEVICE_UID,
  appBaseUrl: process.env.APP_BASE_URL,
};

export default config;
