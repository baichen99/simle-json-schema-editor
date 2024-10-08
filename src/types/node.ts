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
