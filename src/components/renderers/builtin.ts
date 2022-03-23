/**
 * This file registers the built-in renderers.
 */

import * as Renderers from './renderers';
import * as AppModel from './../../services/AppModel';
import TextReadingRendererComponent from '../elements/TextReadingRenderer';
import NoOpReadingRendererComponent from '../elements/NoopReadingRenderer';



export function registerRenderers(rendererRegistry: Renderers.RendererRegistry) {
    const defaultRenderer = TextReadingRendererComponent;    

    const textRendererTypes = 
    [   AppModel.GatewaySensorTypeNames.VOLTAGE,  AppModel.GatewaySensorTypeNames.TEMPERATURE, 

        AppModel.NodeSensorTypeNames.TEMPERATURE,
        AppModel.NodeSensorTypeNames.HUMIDITY,  AppModel.NodeSensorTypeNames.AIR_PRESSURE,
        AppModel.NodeSensorTypeNames.PIR_MOTION,
        AppModel.NodeSensorTypeNames.VOLTAGE ];

    textRendererTypes.forEach(selectorValue => {
        console.log("registering renderer for ", selectorValue)
        rendererRegistry.registerReadingRenderer({ 
            selector: Renderers.SensorTypeSelector.NAME,
            selectorValue,
            visualization: Renderers.ReadingVisualization.CARD
        }, defaultRenderer
    )});

    rendererRegistry.registerReadingRenderer({selector: Renderers.SensorTypeSelector.NAME,
        selectorValue: AppModel.NodeSensorTypeNames.PIR_MOTION_TOTAL, 
        visualization:  Renderers.ReadingVisualization.CARD}, NoOpReadingRendererComponent);

}