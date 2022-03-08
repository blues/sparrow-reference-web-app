import NotehubLocation from './notehub/models/NotehubLocation'


interface SparrowEvent {

  /**
   * Events that relate to a specific node have this value set to the node EUI. 
   */
  nodeID?: string;

  /**
   * The device UID of the gateway that forwarded this event.
   */
  gatewayUID: string;

  /**
   * The simplified name of the event.
   */
  eventName: string;

  /**
   * The projectUID of the event
   */
  projectUID: string;

  /**
   * The time the event was published by the device.
   */
  when: Date;

  /**
   * The format of the event depends upon the event type. 
   */
  eventBody: unknown;

  /**
   * The location of the gateway 
   */
  gatewayLocation?: NotehubLocation;

  /**
   * The gateway name
   */
  gatewayName: string;
}

export class BasicSparrowEvent implements SparrowEvent {
  
  constructor(
      readonly projectUID: string,
      readonly gatewayUID: string,
      readonly when: Date,
      readonly eventName: string,
      readonly nodeID: string | undefined,
      readonly gatewayLocation: NotehubLocation | undefined,
      readonly eventBody: unknown,
      readonly gatewayName: string) {}
}


interface SparrowEventHandler {

  handleEvent(event: SparrowEvent) : Promise<void>;

}
  
/**
 * /dev/null for events.
 */
export class NoopSparrowEventHandler implements SparrowEventHandler {
    
    handleEvent(event: SparrowEvent): Promise<void> {
        return Promise.resolve();
    }

}

export type { SparrowEventHandler, SparrowEvent }