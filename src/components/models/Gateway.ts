import Node from "./Node";

interface Gateway {
  /**
   * The unique identifier for this gateway
   */
  uid: string;

  /**
   * The name for this gateway.
   */
  name: string;
  lastActivity: string;
  location?: string;
  voltage: number;
  /**
   * The signal strength for this gateway - either cell bars or wifi bars.
   */
  cellBars?: number;
  wifiBars?: number;

  nodeList: Node[];
}

export default Gateway;
