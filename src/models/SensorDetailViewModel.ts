interface SensorDetailViewModel {
  gateway?: {
    serialNumber: string;
  };
  sensor?: {
    name: string;
    location: string;
    lastActivity: string;
    temperature: string;
    humidity: string;
    pressure: string;
    voltage: string;
  };
  readings?: {
    temperature: { when: string; value: number }[];
    humidity: { when: string; value: number }[];
    pressure: { when: string; value: number }[];
    voltage: { when: string; value: number }[];
  };
}

export default SensorDetailViewModel;
