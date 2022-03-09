import { getFormattedLastSeen, getFormattedVoltageData } from "./uiHelpers";
import { GATEWAY_MESSAGE } from "../../constants/ui";
import Gateway from "../models/Gateway";
import GatewayDetailViewModel from "../../models/GatewayDetailViewModel";
import Node from "../models/Node";

// eslint-disable-next-line import/prefer-default-export
export function getGatewayDetailsPresentation(
  gateway?: Gateway,
  nodes?: Node[]
): GatewayDetailViewModel {
  return {
    gateway: {
      uid: gateway?.uid || "",
      lastActivity: getFormattedLastSeen(gateway?.lastActivity || ""),
      location:
        gateway && gateway?.location
          ? gateway.location
          : GATEWAY_MESSAGE.NO_LOCATION,
      serialNumber: gateway?.serialNumber || GATEWAY_MESSAGE.NO_SERIAL_NUMBER,
      voltage: gateway
        ? getFormattedVoltageData(gateway?.voltage) || ""
        : GATEWAY_MESSAGE.NO_VOLTAGE,
    },
    nodes,
  };
}
