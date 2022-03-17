// Declare process.ENV types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HUB_BASE_URL: string;
      HUB_API_CLIENT_ID: string;
      HUB_API_CLIENT_SECRET: string; // TODO(carl) remove LOC once a-team devs shun HUB_APP_UID
      HUB_PROJECTUID: string;
      HUB_DEVICE_UID: string;
      APP_BASE_URL: string;
      TEST_NODE_ID: string;
    }
  }
}

// Empty export statement to treat this file as a module
export {};
