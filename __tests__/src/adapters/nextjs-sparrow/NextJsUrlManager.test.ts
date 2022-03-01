/**
 * @jest-environment node
 */
import { NextJsUrlManager } from "../../../../src/adapters/nextjs-sparrow/NextJsUrlManager";

describe(NextJsUrlManager.sensorNameUpdate, () => {
  it("should return correct endpoint url", () => {
    expect(
      NextJsUrlManager.sensorNameUpdate("gfoo", "sbar")
    ).toMatchInlineSnapshot(`"/api/gateway/gfoo/sensor/sbar/config"`);
  });
});
