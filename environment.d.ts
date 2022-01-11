// Declare process.ENV types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HUB_BASE_URL: string;
      HUB_AUTH_TOKEN: string;
      HUB_APP_UID: string;
      HUB_PRODUCT_UID: string;
      HUB_DEVICE_UID: string;
      APP_BASE_URL: string;
      TEST_SENSOR_MAC: string;
    }
  }
}

// Empty export statement to treat this file as a module
export {};
