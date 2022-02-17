export interface AttributeStore {
  updateSensorName: (
    gatewayUID: string,
    macAddress: string,
    name: string
  ) => Promise<boolean>;
  updateSensorLocation: (
    gatewayUID: string,
    macAddress: string,
    location: string
  ) => Promise<boolean>;
}
