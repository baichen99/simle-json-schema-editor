import React from "react";
import NestedList from "./NestedList";
import { useNodeStore } from "@/store/node";
import { Node } from "@/types/node";

const DraggableList: React.FC<Node> = (node) => {
  const { deleteNode, addEmptyNode, getChildren, setSelectNode } =
    useNodeStore();
  console.log("draggableList rerender");
  return (
    <NestedList
      {...node}
      deleteNode={deleteNode}
      addEmptyNode={addEmptyNode}
      getChildren={getChildren}
      setSelectNode={setSelectNode}
    />
  );
};

export default DraggableList;
