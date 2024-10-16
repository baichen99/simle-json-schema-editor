import { useNodeStore } from "@/store/node";
import DraggableList from "@/components/DraggaleList"; // Adjusted path for the refactored component
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { NodeType, Node } from "@/types/node";
import { useEffect, useRef } from "react";
import { debounce } from "lodash-es";
import PropsEdit from "components/form/PropsEdit";
import JsonViewSheet from "components/JsonViewSheet";
import { Card, CardContent, CardHeader } from "components/ui/card";

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
  const {
    rootId,
    findNode,
    initialize,
    moveNode,
    selectedNode,
    updateNode,
    getFullTree,
  } = useNodeStore();
  const tree = getFullTree();
  const rootNode = findNode(rootId) as Node;
  if (!rootNode) {
    initialize({
      id: nanoid(),
      title: "root",
      nodeType: "object",
      children: [],
    });
  }
  const propsEditRef = useRef<{
    reset: (data: Partial<Node>) => void;
  } | null>(null);

  useEffect(() => {
    propsEditRef.current?.reset({
      ...selectedNode,
    });
  }, [selectedNode]);

  const handleUpdate = debounce((data) => {
    if (!selectedNode) return;
    updateNode(selectedNode?.id, { ...data });
  }, 30);

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
      <div className="w-3/4 overflow-y-scroll max-h-screen">
        <Card>
          <CardHeader className="text-neutral-600 font-light text-2xl">
            工作区
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={onDragEnd}>
              <DraggableList {...rootNode} />
            </DragDropContext>
          </CardContent>
        </Card>
      </div>

      <div className="w-1/4 flex flex-col gap-y-2 px-2 py-4">
        <Card className="p-2">
          <div className="flex items-center">
            <JsonViewSheet value={tree!} />
          </div>
        </Card>
        <Button variant="outline" onClick={() => initialize(initialRoot)}>
          初始化数据
        </Button>
        <Card>
          <CardHeader className="text-neutral-600 font-light text-2xl">
            属性编辑区
          </CardHeader>
          <CardContent>
            <PropsEdit
              nodeType={selectedNode?.nodeType || ""}
              ref={propsEditRef}
              onSubmit={(data) => {
                console.log("onsubmit", data);
                handleUpdate(data);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
