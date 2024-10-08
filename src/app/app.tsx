import { useNodeStore } from "@/store/node";
import DraggableList from "@/components/DraggaleList"; // Adjusted path for the refactored component
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { DragDropContext } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";
import type { NodeType, Node } from "@/types/node";
import React, { useEffect, useState } from "react";
import { debounce } from "lodash-es";

type _Node = {
  id: string;
  title: string;
  nodeType: NodeType;
  children: _Node[];
  parentId?: string | null;
};
const initialRoot: _Node = {
  id: "root",
  title: "root",
  nodeType: "object",
  children: [
    {
      id: nanoid(),
      title: "userInfo",
      nodeType: "object",
      children: [
        {
          id: nanoid(),
          title: "username",
          nodeType: "string",
          children: [],
        },
        {
          id: nanoid(),
          title: "password",
          nodeType: "string",
          children: [],
        },
      ],
    },
    {
      id: nanoid(),
      title: "description",
      nodeType: "string",
      children: [],
    },
  ],
};

const App = () => {
  const { rootId, findNode, initialize, moveNode, selectedNode, updateNode, getFullTree } =
    useNodeStore();
  const root = getFullTree();

  const [localNode, setLocalNode] = useState<Node | null>(null)

  useEffect(() => {
    setLocalNode(selectedNode)
  }, [selectedNode])

  const handleUpdate = debounce(() => {
    updateNode(selectedNode?.id, { ...localNode })
  }, 300)

  useEffect(() => {
    handleUpdate()
  }, [localNode])

  const onDragEnd = (results: DropResult) => {
    const { destination } = results;
    if (!destination) {
      return;
    }
    const id = results.draggableId;
    const parentId = destination.droppableId;
    const index = destination.index;
    moveNode(id, parentId, index);
  };

  return (
    <div className="flex">
      <div className="w-4/5 overflow-y-scroll max-h-screen">
        <DragDropContext onDragEnd={onDragEnd}>
          <DraggableList {...root} />
        </DragDropContext>
      </div>

      <div>
        <p>{JSON.stringify(root, null, 2)}</p>
        <Button onClick={() => initialize(initialRoot)}>初始化</Button>{" "}
        <form>
          id： <input type="text" value={selectedNode?.id} readOnly />
          title：{" "}
          <input
            type="text"
            value={localNode?.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setLocalNode({ ...localNode, title: e.target.value });
            }}
          />
          nodeType：{" "}
          <input
            type="text"
            value={localNode?.nodeType}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setLocalNode({ ...localNode, nodeType: e.target.value as NodeType });
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default App;
