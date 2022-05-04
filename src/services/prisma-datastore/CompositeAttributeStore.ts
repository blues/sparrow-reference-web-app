import Gateway from "../../components/models/Gateway";
import Node from "../../components/models/Node";
import { AttributeStore } from "../AttributeStore";


export default class CompositeAttributeStore implements AttributeStore {

    constructor(private stores: AttributeStore[]) {}

    private apply(fn:(store: AttributeStore) => Promise<void>): Promise<void> {
        if (this.stores.length==0) {
            return Promise.reject();
        }

        const tail = async (p:Promise<void>, index: number): Promise<void> => {
            if (index<this.stores.length) {
                await p;
                return await tail(fn(this.stores[index]), index++);
            }
            else {
                return p;
            }
        };

        return tail(fn(this.stores[0]), 1);
    }

    updateGatewayName(gatewayUID: string, name: string): Promise<void> {
        return this.apply(store => store.updateGatewayName(gatewayUID, name));
    }

    updateNodeName(gatewayUID: string, nodeId: string, name: string): Promise<void> {
        return this.apply(store => store.updateNodeName(gatewayUID, nodeId, name));
    }

    updateNodeLocation(gatewayUID: string, nodeId: string, location: string): Promise<void> {
        return this.apply(store => store.updateNodeLocation(gatewayUID, nodeId, location));
    }

}