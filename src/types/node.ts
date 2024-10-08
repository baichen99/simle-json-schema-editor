export type NodeType =
  | "object"
  | "array"
  | "string"
  | "integer"
  | "number"
  | "boolean"
  | "null";

export type Node = {
  id: string;
  title: string;
  nodeType: NodeType;
  children: string[];
  parentId?: string | null;
};

// 树根节点，children包含子节点的object
export type _Node = {
  id: string;
  title: string;
  nodeType: NodeType;
  children: _Node[]; // Keep children as full objects
  parentId?: string | null;
};
