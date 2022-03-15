interface Node {
  name?: string;
  nodeId?: string;
  location?: string;
  humidity?: number;
  pressure?: number;
  temperature?: number;
  voltage?: number;
  lastActivity?: string;
  count?: number;
  total?: number;
  gatewayUID?: string;
}

export default Node;
