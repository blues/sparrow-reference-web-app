import Node from "./Node";

interface Gateway {
  uid: string;
  name: string;
  lastActivity: string;
  location?: string;
  voltage: number;
  nodeList: Node[];
}

export default Gateway;
