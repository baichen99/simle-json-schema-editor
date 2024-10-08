import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Trash } from 'lucide-react';
import type { DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { Node } from '@/types/node';
import { cn } from '@/lib/utils';
import Item from './Item';

type NestedListProps = Node & {
    deleteNode: (id: string) => void;
    addEmptyNode: (id: string) => void;
    getChildren: (id: string) => Node[];
    setSelectNode: (id: string) => void;
};

const NestedList: React.FC<NestedListProps> = ({ id, title, nodeType, addEmptyNode, deleteNode, getChildren, setSelectNode }) => {
    return (
        <Droppable droppableId={id} key={id} type={id}>
            {(dropProvided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => (
                <Card
                    {...dropProvided.droppableProps}
                    ref={dropProvided.innerRef}
                    className={cn('pl-4 flex flex-col py-4 gap-y-4 px-4', dropSnapshot.isDraggingOver && 'bg-gray-100')}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectNode(id);
                    }}
                >
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <div className="rounded flex flex-row-reverse">
                            <Button
                                className="mr-2"
                                variant="danger"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNode(id);
                                }}
                            >
                                <Trash size={16} />
                            </Button>
                        </div>
                    </CardHeader>

                    {getChildren(id).map((item: Node, index: number) => (
                        ['object', 'array'].includes(item.nodeType) && item.children.length > 0 ? (
                            <Draggable draggableId={item.id} key={item.id} index={index}>
                                {(dragProvided: DraggableProvided, dragSnapshot: DraggableStateSnapshot) => (
                                    <div
                                        ref={dragProvided.innerRef}
                                        {...dragProvided.draggableProps}
                                        {...dragProvided.dragHandleProps}
                                        className={cn('', dragSnapshot.isDragging && 'bg-green-200')}
                                    >
                                        <NestedList
                                            {...item}
                                            deleteNode={deleteNode}
                                            addEmptyNode={addEmptyNode}
                                            getChildren={getChildren}
                                            setSelectNode={setSelectNode}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ) : (
                            <Item
                                key={item.id}
                                node={item}
                                index={index}
                                deleteNode={deleteNode}
                                setSelectNode={setSelectNode}
                            />
                        )
                    ))}

                    {['object', 'array'].includes(nodeType) && (
                        <div className="w-full flex justify-center items-center">
                            <Button
                                className="w-1/2"
                                variant="success"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addEmptyNode(id);
                                }}
                            >
                                +
                            </Button>
                        </div>
                    )}
                    {dropProvided.placeholder}
                </Card>
            )}
        </Droppable>
    );
};

export default NestedList;
