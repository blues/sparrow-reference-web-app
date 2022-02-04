import { createNamespace, getNamespace } from "cls-hooked";
import { services } from "./ServiceLocator";

const NAMESPACE = 'session';

export const ns = createNamespace(NAMESPACE);  


export function contextualize<Context, Result>(fn: (context:Context) => Result): (context:Context) => Result {
    const result = (context: Context) => { return ns.runAndReturn(() => {
        services().sessionContext(context);
        return fn(context);
    })};
    return result;
}

export function contextNamespace() {
    return ns;
}

export interface Store<Type> {
    get():Type;
    set(value:Type):void;
}

export class CLSStore<Type> implements Store<Type> {
    key:string;

    constructor(key: string) {
        this.key = key;
    }
    get(): Type {
        return ns.get(this.key) as Type;
    }
    set(value: Type): void {
        ns.set(this.key, value);
    }
}

export class SimpleStore<Type> implements Store<Type> {
    value:Type;

    constructor(value:Type) {
        this.value = value;
    }

    get() { return this.value; }
    set(value:Type):void { this.value = value; }
}
