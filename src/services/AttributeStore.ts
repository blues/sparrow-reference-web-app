export interface AttributeStore {
  updateSensorName: (
    gatewayUID: string,
    macAddress: string,
    name: string
  ) => void;
  updateSensorLocation: (
    gatewayUID: string,
    macAddress: string,
    location: string
  ) => void;
}
