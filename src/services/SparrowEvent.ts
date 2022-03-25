import NotehubLocation from './notehub/models/NotehubLocation'


interface SparrowEvent {

  // replace these IDs with typed IDs?

  /**
   * The projectUID of the event
   */
   readonly projectUID: string;

  /**
   * Events that relate to a specific node have this value set to the node EUI. 
   */
   readonly nodeID?: string; 

  /**
   * The device UID of the gateway that forwarded this event.
   */
  readonly gatewayUID: string;

  /**
   * The simplified name of the event.
   */
  readonly eventName: string;

  /**
   * The format of the event depends upon the event type. 
   */
  readonly eventBody: unknown;

  /**
  * The time the event was published by the origin device.
  */
  readonly when: Date;

  /**
   * The location of the gateway that forwarded the event
   */
  readonly gatewayLocation?: NotehubLocation;

  /**
   * The gateway name that forwarded the event. 
   * todo - wrap up in GatewayRoutedEvent that includes the details provided by the gateway for all events
   */
  readonly gatewayName: string;
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