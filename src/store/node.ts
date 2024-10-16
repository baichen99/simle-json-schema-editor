import { nanoid } from "nanoid";
import { create } from "zustand";
import { Node, _Node } from "@/types/node";

type State = {
  rootId: string;
  nodes: Node[];
  id2node: Record<string, Node>;
  selectedNode: Node | null;
};

type Action = {
  setSelectNode: (node: Node | string) => void;
  initialize: (node: _Node) => void;
  findNode: (id: string) => Node | null;
  getChildren: (id: string) => Node[];
  findParent: (id: string) => Node | null;
  deleteNode: (id: string) => void;
  addEmptyNode: (parentId: string) => void;
  insertNode: (parentId: string, index: number, node: _Node) => void;
  moveNode: (id: string, parentId: string, index: number) => void;
  updateNode: (id: Node["id"], data: Partial<Node>) => void;
  getFullTree: () => _Node | null;
};

export const useNodeStore = create<State & Action>()((set, get) => ({
  rootId: "",
  id2node: {},
  selectedNode: null,
  setSelectNode: (node: Node | string) => {
    if (typeof node === "string") {
      set({ selectedNode: get().id2node[node] });
    } else {
      set({ selectedNode: node });
    }
  },
  nodes: [],
  // 转换成数组存储
  initialize: (root: _Node) => {
    const id2node: Record<string, Node> = {};
    const walk = (node: _Node, parentId: string | null) => {
      id2node[node.id] = {
        id: node.id,
        title: node.title,
        nodeType: node.nodeType,
        children: node.children.map((child) => child.id),
        parentId,
      };
      node.parentId = parentId;
      node.children.forEach((child) => walk(child, node.id));
    };
    walk(root, null);
    const nodes = Object.values(id2node);
    set({
      id2node,
      nodes,
      rootId: root.id,
    });
  },
  findNode: (id: string) => {
    return get().id2node[id];
  },
  getChildren: (id: string) => {
    const node = get().id2node[id];
    if (!node) return [];
    return node.children.map((childId) => get().id2node[childId]);
  },
  findParent: (id: string) => {
    const node = get().id2node[id];
    return node.parentId ? get().id2node[node.parentId] : null;
  },
  deleteNode: (id: string) => {
    if (id === get().rootId) {
      return;
    }
    const node = get().id2node[id];
    const parent = get().id2node[node.parentId!];
    parent.children = parent.children.filter((childId) => childId !== id);
    delete get().id2node[id];
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
    });
  },
  addEmptyNode: (parentId: string) => {
    const id = nanoid();
    const node: Node = {
      id,
      title: "New Node",
      nodeType: "string",
      children: [],
      parentId,
    };
    const parent = get().id2node[parentId];
    parent.children.push(id);
    set({
      id2node: {
        ...get().id2node,
        [id]: node,
      },
      nodes: [...get().nodes, node],
    });
  },
  insertNode: (parentId: string, index: number, node: _Node) => {
    const id = nanoid();
    const newNode: Node = {
      id,
      title: node.title,
      nodeType: node.nodeType,
      children: [],
      parentId,
    };
    const parent = get().id2node[parentId];
    parent.children.splice(index, 0, id);
    set({
      id2node: {
        ...get().id2node,
        [id]: newNode,
      },
      nodes: [...get().nodes, newNode],
    });
  },
  moveNode: (id: string, parentId: string, index: number) => {
    const node = get().id2node[id];
    const parent = get().id2node[parentId];
    const oldParent = get().id2node[node.parentId!];
    oldParent.children = oldParent.children.filter((childId) => childId !== id);
    node.parentId = parentId;
    parent.children.splice(index, 0, id);
    console.log("move", parent.children);
    set({
      id2node: {
        ...get().id2node,
        [id]: node,
      },
    });
  },
  updateNode: (id: Node["id"], data: Partial<Node>) => {
    console.log("update", id, data);
    set({
      id2node: {
        ...get().id2node,
        [id]: {
          ...get().id2node[id],
          ...data,
        },
      },
    });
  },
  getFullTree: () => {
    const root = get().id2node[get().rootId];
    if (!root) return null;
    const walk = (node: Node, visited: Set<string>): _Node => {
      if (visited.has(node.id)) {
        return {
          ...node,
          children: [],
        }; // 或者返回 null
      }
      visited.add(node.id);

      return {
        ...node,
        children: node.children.map((childId) =>
          walk(get().id2node[childId], visited)
        ),
      };
    };
    return walk(root, new Set());
  },
}));
