import "@testing-library/jest-dom/extend-expect";
import { notehubToSparrow } from "../../../src/lib/gateways";
import NotehubDevice from "../../../src/models/NotehubDevice";
import NotehubLocation from "../../../src/models/NotehubLocation";

function getMockDevice(): NotehubDevice {
  return {
    uid: "",
    serial_number: "",
    provisioned: "",
    last_activity: "",
    contact: "",
    product_uid: "",
    fleet_uids: [],
    voltage: 0,
    temperature: 0,
  };
}

describe("Notehub data parsing", () => {
  const mockLocation: NotehubLocation = {
    when: "",
    name: "Detroit",
    country: "",
    timezone: "",
    latitude: 0,
    longitude: 0,
  };
  const mockLocation2: NotehubLocation = {
    when: "",
    name: "Atlanta",
    country: "",
    timezone: "",
    latitude: 0,
    longitude: 0,
  };

  it("should not produce a location property when none exist", () => {
    const data = notehubToSparrow(getMockDevice());
    expect(data.location).toBe(undefined);
  });

  it("should choose triangulated location over tower", () => {
    const device = getMockDevice();
    device.tower_location = mockLocation;
    device.triangulated_location = mockLocation2;
    const data = notehubToSparrow(device);
    expect(data.location).toBe(mockLocation2.name);
  });

  it("should use tower location if it's the only one available", () => {
    const device = getMockDevice();
    device.tower_location = mockLocation;
    const data = notehubToSparrow(device);
    expect(data.location).toBe(mockLocation.name);
  });
});
