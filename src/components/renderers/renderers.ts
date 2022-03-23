/**
 * This module manages registration of renderers for a given sensor type.
 *
 * some concepts:
 * renderers are optional - the system will try to do the best it can. simple numeric values and strings are
 * rendered. Complex types are rendered as a composite that renders name/value pairs 
 * todo - extend `spec` to describe sensorType for each element in a complex type?
 * probably easier to define a group that the readings are in, and these are handled together as a composite.

 a sensor reading - a single reading. Renderings: card/tile, tablular,
 a series of readings - multiple readings. Renderings: chart, sparkline, aggregate?


future concepts:
* reading groups - how to group multiple distinct values into a group (e.g. motion count/total)
    should this simply be done at the event level - the event groups the data the presentation can then display a group and subvalues.

    
    This code runs entirely in the client
 */

import { Gateway, Node, SensorType, Reading, ReadingSeries } from "../../services/AppModel"

export type TargetSensorHost = {
    readonly node: Node | null,
    readonly gateway: Gateway,

    // todo - add other readings in context to allow for composite renderers that render multiple values.
}

/**
 * All the context required to render a single reading.
 */
export type RenderSensorReadingProps = {
    readonly sensorType: SensorType,
    readonly reading: Reading | null      // optional because a given sensorType may not have a reading yet
} & TargetSensorHost;

/**
 * All the context required to render a series of readings
 */
export type RenderSensorReadingSeriesProps = {
    readonly sensorType: SensorType,
    readonly readingSeries: ReadingSeries
 } & TargetSensorHost;

 /**
  * The expected signature for a reading renderer.
  */
export type SensorReadingRenderer = (props: RenderSensorReadingProps) => JSX.Element|null;
export type SensorReadingSeriesRenderer = (props: RenderSensorReadingSeriesProps) => JSX.Element|null;

/**
 * The selector used to identify a sensor type or set of types.
 */
export const enum SensorTypeSelector {
    NAME,
    UNIT,
    MEASURE
}

export const enum ReadingVisualization {
    /**
     * Visualize the reading as a card, typically on multiple lines.
     */
    CARD,

    /**
     * Visualize the reading as a row in a table.
     */
    TABLE
}

export const enum ReadingSeriesVisualization {
    GRAPH,
    SPARKLINE
}

export type RendererKey = {
    selector: SensorTypeSelector,
    selectorValue: string,
    visualization: ReadingVisualization
};


export interface RendererRegistry {
    /**
     * Registers a renderer for a sensor type selectgor.
     * @param rendererKey   The key used to register this renderer
     * @param renderer      The renderer to register
     */
    registerReadingRenderer(rendererKey: RendererKey, renderer: SensorReadingRenderer):void;
    //registerReadingSeriesRenderer(name: SensorTypeDiscriminator, renderType: ReadingSeriesRenderType, renderer: SensorReadingRenderer):void;
}

export interface ReadingRendererLookup {
    /**
     * Retrieves a visualization for 
     * @param sensorType 
     * @param visualization 
     */
    findRenderer(sensorType: SensorType, visualization: ReadingVisualization): SensorReadingRenderer|null;
}

// todo - it would be good to also be able to render nodes, gateways and other items, not just sensor readings.
// That way the default renderers for gateway and nodes can also be plugged in. 

/**
 * Allows more specific registrations to override
 */
export class OverridingRendererRegistry implements ReadingRendererLookup, RendererRegistry  {
    
    constructor(private readonly renderers = new Map<string, SensorReadingRenderer>()) {}
    
    registerReadingRenderer(rendererKey: RendererKey, renderer: SensorReadingRenderer): void {
        this.renderers.set(this.keyToString(rendererKey), renderer);        
    }

    findRenderer(sensorType: SensorType, visualization: ReadingVisualization): SensorReadingRenderer | null {
        // try from most specific to least specific
        return  this.lookup(SensorTypeSelector.NAME, sensorType.name, visualization) ||
                this.lookup(SensorTypeSelector.UNIT, sensorType.unit, visualization) ||
                this.lookup(SensorTypeSelector.MEASURE, sensorType.measure, visualization) ||
                null;
    }


    private lookup(selector: SensorTypeSelector, selectorValue: string, visualization: ReadingVisualization): SensorReadingRenderer | undefined {
        return this.renderers.get(this.keyToString({
            selector, selectorValue, visualization
        }));      
    }

    // have to convert the composite key to a string because Maps do not do "by value" quality for non-primitive types.
    // Object equality means reference equality. 
    private keyToString(key: RendererKey) {
        return `${key.selector}:${key.selectorValue}:${key.visualization}`;
    }
}
