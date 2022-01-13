import "@testing-library/jest-dom/extend-expect";
import { notehubToSparrow } from "../../../src/lib/gateways";
import NotehubDevice from "../../../src/models/NotehubDevice";
import NotehubLocation from "../../../src/models/NotehubLocation";

describe("Notehub data parsing", () => {
  it("should select the appropriate location", () => {
    const mockDevice: NotehubDevice = {
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

    // When no locations are present the location property should not exist
    let data = notehubToSparrow(mockDevice);
    expect(data.location).toBe(undefined);

    // With both locations present, pick the triangulated one
    mockDevice.tower_location = mockLocation;
    mockDevice.triangulated_location = mockLocation2;
    data = notehubToSparrow(mockDevice);
    expect(data.location).toBe(mockLocation2.name);

    // If only the tower location is available, use that
    delete mockDevice.triangulated_location;
    data = notehubToSparrow(mockDevice);
    expect(data.location).toBe(mockLocation.name);
  });
});
