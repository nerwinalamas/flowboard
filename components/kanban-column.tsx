"use client";

import { Column } from "@/lib/schema";
import { ColumnType, useTaskModal } from "@/hooks/useTaskModal";
import { useColumnModal } from "@/hooks/useColumnModal";
import { useKanbanStore } from "@/hooks/useKanbanStore";
import { Archive, ArrowDownUp, Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./task-card";
import { toast } from "sonner";
import KanbanDropdownMenu, { DropdownMenuItem } from "./kanban-dropdown-menu";

interface KanbanColumnProps {
  column: Column;
}

const KanbanColumn = ({ column }: KanbanColumnProps) => {
  const { onOpen: onTaskModalOpen } = useTaskModal();
  const { onOpen: onColumnModalOpen } = useColumnModal();
  const {
    duplicateColumn,
    togglePrioritySort,
    archiveColumn,
    getFilteredTasks,
  } = useKanbanStore();

  const filteredTasks = getFilteredTasks(column.id);
  const taskCount = filteredTasks.length;

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
    data: {
      accepts: ["task"],
      filteredTasks: filteredTasks.map((task) => task.id),
    },
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

  const handleArchiveColumn = (columnId: string) => {
    try {
      archiveColumn(columnId);

      toast.success("Column archived successfully");
    } catch (error) {
      console.log("Error archiving column:", error);
      toast.error("Failed to archive column");
    }
  };

  const DROPDOWN_MENU_ITEMS: DropdownMenuItem[] = [
    {
      label: "Add Task",
      icon: Plus,
      onClick: () => onTaskModalOpen("createTask", column.id as ColumnType),
    },
    {
      label: "Edit",
      icon: Pencil,
      onClick: () => onColumnModalOpen("editColumn", column),
    },
    {
      label: "Duplicate",
      icon: Copy,
      onClick: () => handleDuplicateColumn(column.id),
    },
    {
      label: "Sort",
      icon: ArrowDownUp,
      onClick: () => togglePrioritySort(column.id),
    },
    {
      label: "Archive",
      icon: Archive,
      onClick: () => handleArchiveColumn(column.id),
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: () => onColumnModalOpen("deleteColumn", column),
      className: "text-red-600 focus:text-red-600",
    },
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      suppressHydrationWarning={true}
      aria-disabled={false}
      className="w-[400px] min-h-[405px] h-full flex flex-col bg-accent dark:bg-accent/40 space-y-4 p-4 rounded-lg shadow-sm backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">
          {column.title}{" "}
          <span className="ml-2 text-muted-foreground text-sm">
            ({taskCount})
          </span>
        </div>
        <KanbanDropdownMenu
          items={DROPDOWN_MENU_ITEMS}
          className="hover:bg-primary-foreground dark:hover:bg-accent"
        />
      </div>

      <div
        ref={setTasksRef}
        className="space-y-3 flex-1 p-2 rounded-md border border-dashed border-muted-foreground/50 transition-colors duration-200 hover:border-muted-foreground"
      >
        <SortableContext
          items={filteredTasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {filteredTasks.length === 0 ? (
            <div className="flex h-24 items-center justify-center">
              <p className="text-sm text-muted-foreground">No tasks found.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
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
