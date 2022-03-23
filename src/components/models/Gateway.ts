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

  // todo add other sensor readings, e.g. temperature

  nodeList: Node[];
}

export default Gateway;
