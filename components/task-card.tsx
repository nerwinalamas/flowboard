"use client";

import { Task } from "@/lib/schema";
import { ColumnType, useTaskModal } from "@/hooks/useTaskModal";
import { useKanbanStore } from "@/hooks/useKanbanStore";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import KanbanDropdownMenu, { DropdownMenuItem } from "./kanban-dropdown-menu";

interface TaskCardProps {
  task: Task;
  columnId: ColumnType;
}

const TaskCard = ({ task, columnId }: TaskCardProps) => {
  const { onOpen } = useTaskModal();

  const duplicateTask = useKanbanStore((state) => state.duplicateTask);

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
    high: "bg-red-100 text-red-800 hover:bg-red-100/80",
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const handleDuplicateTask = (taskId: string, columnId: string) => {
    try {
      duplicateTask(taskId, columnId);

      toast.success("Task duplicated successfully");
    } catch (error) {
      console.log("Error duplicating task:", error);
      toast.error("Failed to duplicate task");
    }
  };

  const DROPDOWN_MENU_ITEMS: DropdownMenuItem[] = [
    {
      label: "Edit",
      icon: Pencil,
      onClick: () => onOpen("editTask", columnId, task),
    },
    {
      label: "Duplicate",
      icon: Copy,
      onClick: () => handleDuplicateTask(task.id, columnId),
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: () => onOpen("deleteTask", columnId, task),
      className: "text-red-600 focus:text-red-600",
    },
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-describedby="DndDescribedBy-0"
      className="w-full space-y-2 border bg-background p-4 rounded-lg cursor-pointer shadow-sm hover:bg-background/50 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium">{task.title}</h3>

        <KanbanDropdownMenu items={DROPDOWN_MENU_ITEMS} />
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {task.description}
      </p>
      <Badge
        className={priorityColors[task.priority as keyof typeof priorityColors]}
      >
        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
      </Badge>
    </div>
  );
};

export default TaskCard;
