import { ErrorWithCause } from "pony-cause";

// Polyfill that wraps the JavaScript error object to support a cause property.
// When TypeScript officially supports the `new Error(message, { cause: e })`
// syntax we can just use that directly.
//
// See https://2ality.com/2021/06/error-cause.html
export function getError(message: string, options?: { cause: Error }) {
  return new ErrorWithCause(message, options);
}

export const ERROR_CODES = {
  UNAUTHORIZED: "1",
  FORBIDDEN: "2",
  GATEWAY_NOT_FOUND: "3",
  INTERNAL_ERROR: "4",
};
