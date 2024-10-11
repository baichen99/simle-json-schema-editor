import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { Node } from "@/types/node";

type ItemProps = {
  node: Node;
  index: number;
  deleteNode: (id: string) => void;
  setSelectNode: (id: string) => void;
};

const Item: React.FC<ItemProps> = ({
  node,
  index,
  deleteNode,
  setSelectNode,
}) => {
  return (
    <Draggable draggableId={node.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`p-2 border rounded ${
            snapshot.isDragging ? "bg-green-200" : "bg-white"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectNode(node.id);
          }}
        >
          <CardHeader>
            <CardTitle>{node.title}</CardTitle>
            <div className="rounded flex flex-row-reverse">
              <Button
                className="mr-2"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
              >
                <Trash size={16} />
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}
    </Draggable>
  );
};

export default Item;
