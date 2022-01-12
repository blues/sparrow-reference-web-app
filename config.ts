const debugLog = console.log; // eslint-disable-line no-console

/*
  Note: In order to keep server-only secrets safe, Next.js replaces process.env.foo with the correct
  value at build time. This means that process.env is not a standard JavaScript object, so you’re
  not able to use object destructuring. Environment variables must be referenced as e.g.
  process.env.NEXT_PUBLIC_PUBLISHABLE_KEY, not const { NEXT_PUBLIC_PUBLISHABLE_KEY } = process.env.
*/
const env = {
  APP_BASE_URL: process.env.APP_BASE_URL,
  DEBUG_CONFIG: process.env.DEBUG_CONFIG,
  HUB_APP_UID: process.env.HUB_APP_UID,
  HUB_AUTH_TOKEN: process.env.HUB_AUTH_TOKEN,
  HUB_BASE_URL: process.env.HUB_BASE_URL,
  HUB_DEVICE_UID: process.env.HUB_DEVICE_UID,
  HUB_PRODUCT_UID: process.env.HUB_PRODUCT_UID,
  NEXT_PUBLIC_COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME,
};

const optionalEnvVar = (varName: keyof typeof env, defaultValue: string) => {
  const val = env[varName];
  if (val === undefined) {
    return defaultValue;
  }
  return val;
};

const requiredEnvVar = (varName: keyof typeof env) => {
  const val = env[varName];
  if (val === undefined) {
    throw new Error(
      `${varName} is not set in the environment. See .env.local.example for help.`
    );
  }
  return val;
};

const Config = {
  // These are getters so undefined required variables do not throw errors at build time.
  get appBaseUrl() {
    return requiredEnvVar("APP_BASE_URL");
  },
  get companyName() {
    return optionalEnvVar("NEXT_PUBLIC_COMPANY_NAME", "Nada Company");
  },
  get debugConfig() {
    return Boolean(optionalEnvVar("DEBUG_CONFIG", ""));
  },
  get hubAppUID() {
    return requiredEnvVar("HUB_APP_UID");
  },
  get hubAuthToken() {
    return requiredEnvVar("HUB_AUTH_TOKEN");
  },
  get hubBaseURL() {
    return optionalEnvVar("HUB_BASE_URL", "https://api.notefile.net");
  },
  get hubDeviceUID() {
    return requiredEnvVar("HUB_DEVICE_UID");
  },
  get hubProductUID() {
    return requiredEnvVar("HUB_PRODUCT_UID");
  },
};

const toString = (c: typeof Config | typeof env) => {
  const indent = 2;
  return JSON.stringify(c, undefined, indent);
};

if (Config.debugConfig) {
  try {
    debugLog(`Derived config: ${toString(Config)}`);
    debugLog(`Environment: ${toString(env)}`);
  } catch (error) {
    debugLog(
      `Program isn't configured fully and likely won't work until it is.`
    );
  }
}

export default Config;
