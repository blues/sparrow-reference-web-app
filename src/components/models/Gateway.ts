import Node from "./Node";

interface Gateway {
  uid: string;
  serialNumber: string;
  lastActivity: string;
  location?: string;
  voltage: number;
  nodeList: Node[];
}

export default Gateway;
