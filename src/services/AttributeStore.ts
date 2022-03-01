export interface AttributeStore {
  updateSensorName: (
    gatewayUID: string,
    macAddress: string,
    name: string
  ) => Promise<void>;
  updateSensorLocation: (
    gatewayUID: string,
    macAddress: string,
    location: string
  ) => Promise<void>;
}
