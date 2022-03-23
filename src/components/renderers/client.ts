import * as BuiltinRenderers from "./builtin";
import * as CustomRenderers from "./custom";
import { OverridingRendererRegistry } from "./renderers";

const registry = new OverridingRendererRegistry();

BuiltinRenderers.registerRenderers(registry);
CustomRenderers.registerRenderers(registry);

export default registry;