"use client";

import { Column } from "@/lib/schema";
import { ColumnType, useTaskModal } from "@/hooks/useTaskModal";
import { useColumnModal } from "@/hooks/useColumnModal";
import { useKanbanStore } from "@/hooks/useKanbanStore";
import {
  ArrowDownUp,
  Copy,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./task-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface KanbanColumnProps {
  column: Column;
}

const KanbanColumn = ({ column }: KanbanColumnProps) => {
  const { onOpen: onTaskModalOpen } = useTaskModal();
  const { onOpen: onColumnModalOpen } = useColumnModal();

  const duplicateColumn = useKanbanStore((state) => state.duplicateColumn);
  const togglePrioritySort = useKanbanStore(
    (state) => state.togglePrioritySort
  );

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

  const handleDuplicateColumn = (columnId: string) => {
    try {
      duplicateColumn(columnId);

      toast.success("Column duplicated successfully");
    } catch (error) {
      console.log("Error duplicating column:", error);
      toast.error("Failed to duplicate column");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      suppressHydrationWarning={true}
      aria-disabled={false}
      className="w-[400px] min-h-[345px] h-full bg-accent dark:bg-accent/40 space-y-4 p-4 rounded-lg shadow-sm backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">
          {column.title}{" "}
          <span className="ml-2 text-muted-foreground text-sm">
            ({column.tasks.length})
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-secondary hover:cursor-pointer"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                onTaskModalOpen("createTask", column.id as ColumnType)
              }
              className="cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onColumnModalOpen("editColumn", column)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDuplicateColumn(column.id)}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => togglePrioritySort(column.id)}
              className="cursor-pointer"
            >
              <ArrowDownUp className="mr-2 h-4 w-4" />
              Sort
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onColumnModalOpen("deleteColumn", column)}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        ref={setTasksRef}
        className="space-y-3 min-h-[270px] h-full p-2 rounded-md border border-dashed border-muted-foreground/50 transition-colors duration-200 hover:border-muted-foreground"
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
