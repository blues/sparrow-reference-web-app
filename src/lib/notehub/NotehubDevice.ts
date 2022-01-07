import NotehubLocation from "./NotehubLocation";

// lets move the notehub structs into a separate package
interface NotehubDevice {
  uid: string;
  serial_number: string;
  provisioned: string;
  last_activity: string;
  contact: string;
  product_uid: string;
  fleet_uids: string[];
  tower_location?: NotehubLocation;
  gps_location?: NotehubLocation;
  triangulated_location?: NotehubLocation;
  voltage: number;
  temperature: number;
}

export default NotehubDevice;
