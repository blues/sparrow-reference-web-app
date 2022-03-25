
// todo - this is quite generic. Could be moved out of the notehub package.

interface NotehubLocation {
  when: number;
  name: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
}

export default NotehubLocation;
