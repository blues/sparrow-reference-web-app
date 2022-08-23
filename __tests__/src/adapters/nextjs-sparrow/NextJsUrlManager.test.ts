/**
 * @jest-environment node
 */
import { NextJsUrlManager } from "../../../../src/adapters/nextjs-sparrow/NextJsUrlManager";

/* eslint-disable jest/valid-title */
/* eslint-disable @typescript-eslint/unbound-method */

describe(NextJsUrlManager.nodeNameUpdate, () => {
  it("should return correct endpoint url", () => {
    expect(
      NextJsUrlManager.nodeNameUpdate("gfoo", "sbar")
    ).toMatchInlineSnapshot(`"/api/gateway/gfoo/node/sbar/config"`);
  });
});

describe(NextJsUrlManager.notifications, () => {
  it("returns the base API endpoint when no ids are present", () => {
    expect(NextJsUrlManager.notifications()).toMatchInlineSnapshot(
      `"/api/notifications"`
    );
  });

  it("returns a signle ID as an 'id' query parameter", () => {
    expect(NextJsUrlManager.notifications("foo")).toMatchInlineSnapshot(
      `"/api/notifications?id=foo"`
    );
  });

  it("returns multiple ID as multiple 'id' query parameters", () => {
    expect(
      NextJsUrlManager.notifications("foo", "bar", "baz")
    ).toMatchInlineSnapshot(`"/api/notifications?id=foo&id=bar&id=baz"`);
  });
});
