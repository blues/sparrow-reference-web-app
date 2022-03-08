const debugLog = console.log; // eslint-disable-line no-console

/*
  Note: In order to keep server-only secrets safe, Next.js replaces process.env.foo with the correct
  value at build time. This means that process.env is not a standard JavaScript object, so you’re
  not able to use object destructuring. Environment variables must be referenced as e.g.
  process.env.NEXT_PUBLIC_PUBLISHABLE_KEY, not const { NEXT_PUBLIC_PUBLISHABLE_KEY } = process.env.
*/
const env = {
  DEBUG_CONFIG: process.env.DEBUG_CONFIG,
  HUB_APP_UID: process.env.HUB_APP_UID,
  HUB_AUTH_TOKEN: process.env.HUB_AUTH_TOKEN,
  HUB_BASE_URL: process.env.HUB_BASE_URL,
  HUB_DEVICE_UID: process.env.HUB_DEVICE_UID,
  HUB_PROJECTUID: process.env.HUB_PROJECTUID,
  NEXT_PUBLIC_BUILD_VERSION: process.env.NEXT_PUBLIC_BUILD_VERSION,
  NEXT_PUBLIC_COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME,

  // TODO - delete when we're not making calls to the api from the server
  APP_BASE_URL: process.env.APP_BASE_URL,
  // TODO - delete when we're not making calls to the api from the server
  DEPLOY_URL: process.env.DEPLOY_URL, // Netlify URL for an individual deploy
  // todo delete in future - these values only exists so we can configure how far in the past we're pulling Notehub data
  HUB_HISTORICAL_DATA_START_DATE: process.env.HUB_HISTORICAL_DATA_START_DATE,
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
    return optionalEnvVar("DEPLOY_URL", "") || requiredEnvVar("APP_BASE_URL");
  },
  get buildVersion() {
    return optionalEnvVar("NEXT_PUBLIC_BUILD_VERSION", "ver n/a");
  },
  get companyName() {
    return optionalEnvVar("NEXT_PUBLIC_COMPANY_NAME", "Nada Company");
  },
  get debugConfig() {
    return Boolean(optionalEnvVar("DEBUG_CONFIG", ""));
  },
  get hubProjectUID() {
    return (
      optionalEnvVar("HUB_APP_UID", "") || // TODO(carl) remove LOC once a-team devs shun HUB_APP_UID
      requiredEnvVar("HUB_PROJECTUID")
    );
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
  get hubHistoricalDataStartDate() {
    return parseInt(optionalEnvVar("HUB_HISTORICAL_DATA_START_DATE", "3"), 10);
  },
};

const toString = (c: typeof Config | typeof env) => {
  const indent = 2;
  return JSON.stringify(c, undefined, indent);
};

if (Config.debugConfig) {
  try {
    debugLog(`Environment: ${toString(env)}`);
    debugLog(`Derived config: ${toString(Config)}`);
  } catch (error) {
    debugLog(error);
    debugLog(
      `Program isn't configured fully and likely won't work until it is.`
    );
  }
}

export default Config;
