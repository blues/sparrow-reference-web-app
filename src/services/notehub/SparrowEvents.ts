import { BasicSparrowEvent, SparrowEvent } from "../SparrowEvent";
import NotehubLocation from "./models/NotehubLocation";
import NotehubRoutedEvent from "./models/NotehubRoutedEvent";


function eventError(msg: string, event: NotehubRoutedEvent) {
    return new Error(msg);
}

export function eventLocation(event: NotehubRoutedEvent) : NotehubLocation | undefined {
    return event.best_location ? {
        latitude: event.best_lat,
        longitude: event.best_lon,
        // todo - there isn't a `best_when` but `tri_when`. 
        when: event.when, 
        country: event.best_country,
        timezone: event.best_timezone,
        name: event.best_location
    } : undefined;
}

// These notefiles are also update sensor info with the esensor 
const knownNodefiles = [ "config.db", "sensors.db" ]

/**
 * Produces a SparrowEvent from a parsed notehub event.
 * @param event 
 * @returns 
 */
export function parseSparrowEvent(event: NotehubRoutedEvent) : SparrowEvent {
    
    if (!event.device) {
        throw eventError("device is not defined", event);        
    }

    if (!event.project.id) {
        throw eventError("project.id is not defined", event);        
    }
    const normalized = normalizeSparrowEvent(event.file, event.note);
    const location = eventLocation(event);

    return new BasicSparrowEvent(event.project.id, 
        event.device, new Date(event.when * 1000), normalized.eventName, normalized.nodeID, 
        location, event.body, event.sn);

}

interface NormalizedEventName {
    eventName: string;
    nodeID?: string;
}

/**
 * Normalizes an event name (file) that may either be a simple event name or of the format <nodeEUI>#<eventname>. 
 * 
 * @param file 
 * @returns 
 */
export function normalizeSparrowEvent(file: string, note?: string) : NormalizedEventName {
    let eventName: string;
    let nodeID: string | undefined;
    if (note) {
        eventName = file;
        nodeID = note;
    }
    else {
        const idx = file.indexOf('#');
        if (idx>0) {
            eventName = file.slice(idx+1);
            nodeID = file.slice(0, idx);
        }
        else {
            eventName = file;
            nodeID = note;
        }
    }
    return { eventName, nodeID };
}

export type { SparrowEvent, NormalizedEventName }