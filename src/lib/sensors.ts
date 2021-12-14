import Gateway from "../models/Gateway";

export async function getSensors(gateways: Gateway[]) {
  // Using mock data for now. What we need to do is get the latest events,
  // loop through them to find all unique mac addresses (in the "file" field).
  // Then, for each unique sensor, make a call to /sensor/[macAddress]/config
  // to get the device’s name—and combine all that into the structure below.
  return [
    {
      name: "0F Furnace",
      macAddress: "20323746323650020031002f",

      // We need to get motion data from the motion.qo notes, but we need to
      // understand what that data means. Here is the raw structure.
      // "body": {
      //   "count": 1,
      //   "total": 281
      // }

      // Do we want to include location? This comes back from the config api but
      // we don’t know what it is or means.
      // "loc": "87JFH688+2H",

      humidity: 27.234375,
      pressure: 101152,
      temperature: 22.6875,
      voltage: 2.733,
      lastActivity: "2021-11-30T20:30:19Z",
      gatewayUID: "dev:868050040065365",
    },
    {
      name: "1F Atrium",
      macAddress: "203237343323650020031002f",
      humidity: 25.2343425,
      pressure: 121352,
      temperature: 24.1243,
      voltage: 3.733,
      lastActivity: "2021-11-30T20:30:19Z",
      gatewayUID: "dev:868050040065365",
    }
  ]
};
