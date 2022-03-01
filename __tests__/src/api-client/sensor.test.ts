/**
 * @jest-environment node
 */
import axios from "axios";
import { changeSensorName } from "../../../src/api-client/sensor";

describe(changeSensorName, () => {
  it("should construct good request", async () => {
    const spy = jest
      .spyOn(axios, "post")
      .mockImplementation(() => Promise.resolve({ status: 200 }));

    await changeSensorName("gfoo", "sfoo", "bazname");

    expect(spy).toHaveBeenCalledWith("/api/gateway/gfoo/sensor/sfoo/config", {
      name: "bazname",
    });
  });
});
