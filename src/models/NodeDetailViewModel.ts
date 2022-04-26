import { SignalStrengths } from "../components/presentation/uiHelpers";

interface NodeDetailViewModel {
  gateway?: {
    name: string;
  };
  node?: {
    name: string;
    location: string;
    lastActivity: string;
    temperature: string;
    humidity: string;
    pressure: string;
    voltage: string;
    count: string;
    total: string;
    bars: SignalStrengths;
    barsIconPath?: string;
    barsTooltip?: string;
  };
  readings?: {
    temperature: { when: string; value: number }[];
    humidity: { when: string; value: number }[];
    pressure: { when: string; value: number }[];
    voltage: { when: string; value: number }[];
    count: { when: string; value: number }[];
    total: { when: string; value: number }[];
  };
}

export default NodeDetailViewModel;
