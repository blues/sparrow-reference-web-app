import { ErrorWithCause } from "pony-cause";

// Polyfill that wraps the JavaScript error object to support a cause property.
// When TypeScript officially supports the `new Error(message, { cause: e })`
// syntax we can just use that directly.
//
// See https://2ality.com/2021/06/error-cause.html
export function getError(message: string, options?: { cause: Error }) {
  return new ErrorWithCause(message, options);
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum ERROR_CODES {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  DEVICE_NOT_FOUND = "DEVICE_NOT_FOUND",
  SENSOR_NOT_FOUND = "SENSOR_NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}
