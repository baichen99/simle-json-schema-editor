import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import type {
    DroppableProvided,
    DraggableProvided,
    DroppableStateSnapshot,
    DraggableStateSnapshot
} from 'react-beautiful-dnd';

import { Card, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Trash } from 'lucide-react';
import { useNodeStore } from '@/store/node';
import { Node } from "@/types/node";

type ListProps = Node & {
    deleteNode: (id: string) => void;
    addEmptyNode: (id: string) => void;
    getChildren: (id: string) => Node[];
    setSelectNode: (id: string) => void;
}

// Render a single draggable item
const renderItem = (
    node: Node,
    index: number,
    deleteNode: (id: string) => void,
    setSelectNode: (id: string) => void
) => {
    return (
        <Draggable
            key={node.id}
            draggableId={node.id}
            index={index}
        >
            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                <Card
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className={`p-2 border rounded ${snapshot.isDragging ? 'bg-green-200' : 'bg-white'}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        setSelectNode(node.id)
                    }}
                >
                    <CardHeader>
                        <CardTitle>{node.title}</CardTitle>
                        <div className='rounded flex flex-row-reverse'>
                            <Button className='mr-2' variant='danger' onClick={(e) => {
                                e.stopPropagation()
                                deleteNode(node.id)
                            }}>
                                <Trash size={16} />
                            </Button>
                        </div>
                    </CardHeader>
                </Card>
            )}
        </Draggable>
    );
};

const renderList = ({ id, title, nodeType, addEmptyNode, deleteNode, getChildren, setSelectNode }: ListProps) => {
    return (
        <Droppable
            droppableId={id}
            key={id}
            type={id}
        >
            {(dropProvided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => (
                <Card
                    {...dropProvided.droppableProps}
                    ref={dropProvided.innerRef}
                    className={cn('pl-4 flex flex-col py-4 gap-y-4 px-4', dropSnapshot.isDraggingOver && 'bg-gray-100')}
                    onClick={(e) => {
                        e.stopPropagation()
                        setSelectNode(id)
                    }}
                >
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <div className='rounded flex flex-row-reverse'>
                            <Button className='mr-2' variant='danger' onClick={(e) => {
                                e.stopPropagation()
                                deleteNode(id)
                            }}>
                                <Trash size={16} />
                            </Button>
                        </div>
                    </CardHeader>

                    {getChildren(id).map((item: Node, index: number) => (
                        ['object', 'array'].includes(item.nodeType) && item.children.length > 0 ? (
                            <Draggable
                                draggableId={item.id}
                                key={item.id}
                                index={index}
                            >
                                {(
                                    dragProvided: DraggableProvided,
                                    dragSnapshot: DraggableStateSnapshot
                                ) => (
                                    <div
                                        ref={dragProvided.innerRef}
                                        {...dragProvided.draggableProps}
                                        {...dragProvided.dragHandleProps}
                                        className={cn('', dragSnapshot.isDragging && 'bg-green-200')}
                                    >
                                        <div>
                                        </div>
                                        {renderList({ ...item, deleteNode, addEmptyNode, getChildren, setSelectNode })}
                                    </div>
                                )}
                            </Draggable>
                        ) : (
                            renderItem(item, index, deleteNode, setSelectNode)
                        )
                    ))}
                    {
                        // 当类型为array或object时显示添加按钮
                        ['object', 'array'].includes(nodeType) &&
                        <div className='w-full flex justify-center items-center'>
                            <Button
                                className='w-1/2' variant='success'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    addEmptyNode(id)
                                }}
                            >
                                +
                            </Button>
                        </div>
                    }
                    {dropProvided.placeholder}
                </Card>

            )}
        </Droppable>
    );
};

const DraggableList: React.FC<Node> = (node) => {
    const { deleteNode, addEmptyNode, getChildren, setSelectNode } = useNodeStore()
    return (
        renderList({ ...node, deleteNode, addEmptyNode, getChildren, setSelectNode })
    );
};

export default DraggableList;
