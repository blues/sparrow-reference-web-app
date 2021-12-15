const config = {
  baseURL: process.env.HUB_BASE_URL || "https://api.notefile.net",
  authToken: process.env.HUB_AUTH_TOKEN,
  appUID: process.env.HUB_APP_UID,
  deviceUID: process.env.HUB_DEVICE_UID,
};

export default config;
