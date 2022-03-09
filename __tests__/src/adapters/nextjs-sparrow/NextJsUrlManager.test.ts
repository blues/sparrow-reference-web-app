/**
 * @jest-environment node
 */
import { NextJsUrlManager } from "../../../../src/adapters/nextjs-sparrow/NextJsUrlManager";

describe(NextJsUrlManager.nodeNameUpdate, () => {
  it("should return correct endpoint url", () => {
    expect(
      NextJsUrlManager.nodeNameUpdate("gfoo", "sbar")
    ).toMatchInlineSnapshot(`"/api/gateway/gfoo/node/sbar/config"`);
  });
});
