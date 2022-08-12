import { PrismaClient } from "@prisma/client";
import { AttributeStore, GatewayOrNode } from "../AttributeStore";
import { PrismaDataProvider } from "./PrismaDataProvider";

type HasPin = { pin: string | null };

/**
 * This class wraps a store to also populate
 */
export default class PrismaAttributeStore implements AttributeStore {
  // todo we don't need the full prisma provider interface, just fetchNode/fetch
  constructor(
    private prisma: PrismaClient,
    private dataProvider: PrismaDataProvider
  ) {}

  // todo - we should probably verify against the project ID?
  async updateGatewayName(gatewayUID: string, name: string): Promise<void> {
    await this.prisma.gateway.update({
      where: {
        deviceUID: gatewayUID,
      },
      data: {
        name,
      },
    });
  }

  async updateNodeName(
    gatewayUID: string,
    nodeId: string,
    name: string
  ): Promise<void> {
    await this.prisma.node.update({
      where: {
        nodeEUI: nodeId,
      },
      data: {
        name,
      },
    });
  }

  async updateNodeLocation(
    gatewayUID: string,
    nodeId: string,
    location: string
  ): Promise<void> {
    await this.prisma.node.update({
      where: {
        nodeEUI: nodeId,
      },
      data: {
        locationName: location,
      },
    });
  }

  /**
   * Validates that the pin is correct. Either the device has a pin and the pin must match, or the pin is defined.
   * @param device
   * @param pin
   * @returns
   */
  // eslint-disable-next-line class-methods-use-this
  validatePin(device: HasPin, pin: string): boolean {
    return !!device && !!pin && (!device?.pin || device?.pin === pin);
  }

  async updateDevicePin(
    deviceUID: string,
    pin: string
  ): Promise<GatewayOrNode | null> {
    // todo - sanitize the pin more fully?
    if (!pin || pin.length > 20) {
      return null;
    }

    const node = await this.dataProvider.fetchNode(deviceUID);
    if (node) {
      if (this.validatePin(node, pin)) {
        // update the pin if it is needed
        if (!node.pin) {
          await this.prisma.node.update({
            where: {
              nodeEUI: node.nodeEUI,
            },
            data: {
              pin,
            },
          });
        }
        return { gatewayUID: node.gateway.deviceUID, nodeID: node.nodeEUI };
      }
    } else {
      const gateway = await this.dataProvider.fetchGateway(deviceUID);
      if (gateway) {
        if (this.validatePin(gateway, pin)) {
          if (!gateway.pin) {
            await this.prisma.gateway.update({
              where: {
                deviceUID,
              },
              data: {
                pin,
              },
            });
          }
          return { gatewayUID: gateway.deviceUID };
        }
      }
    }
    return null;
  }
}
