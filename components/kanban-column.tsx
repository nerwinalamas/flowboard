"use client";

import { ColumnType, useTaskModal } from "@/hooks/useTaskModal";
import { Column } from "@/lib/schema";
import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./task-card";
import { Button } from "@/components/ui/button";

interface KanbanColumnProps {
  column: Column;
}

const KanbanColumn = ({ column }: KanbanColumnProps) => {
  const { onOpen } = useTaskModal();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `column-${column.id}`,
    data: {
      type: "column",
      column,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const { setNodeRef: setTasksRef } = useDroppable({
    id: `column-${column.id}`,
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      suppressHydrationWarning={true}
      aria-disabled={false}
      className="w-[400px] min-h-[345px] h-full bg-gray-100 space-y-4 p-4 rounded-lg shadow-sm backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">
          {column.title}{" "}
          <span className="ml-2 text-muted-foreground text-sm">
            ({column.tasks.length})
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onOpen("createTask", column.id as "todo" | "in-progress" | "done")
          }
          className="hover:bg-gray-200 hover:cursor-pointer"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={setTasksRef}
        className="space-y-3 min-h-[270px] h-full p-2 rounded-md border border-dashed border-gray-300 transition-colors duration-200 hover:border-gray-400"
      >
        <SortableContext
          items={column.tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.length === 0 ? (
            <div className="flex h-24 items-center justify-center">
              <p className="text-sm text-muted-foreground">No tasks yet</p>
            </div>
          ) : (
            column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                columnId={column.id as ColumnType}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
