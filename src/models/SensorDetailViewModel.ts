import Gateway from "../components/models/Gateway";

// todo - the attributes of the model shouldn't be optional. It's because the model itself isn't optional but isn't present when an error occurs.
// This can be reworked to create a cleaner model.
interface SensorDetailViewModel {
  sensor?: {
    name: string;
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
  gateway?: Gateway
}

export default SensorDetailViewModel;
