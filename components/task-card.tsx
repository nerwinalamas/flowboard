"use client";

import { Task } from "@/lib/types";
import { useKanbanStore } from "@/hooks/useKanbanStore";
import { ColumnType, useTaskModal } from "@/hooks/useTaskModal";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  columnId: ColumnType;
}

const TaskCard = ({ task, columnId }: TaskCardProps) => {
  const { deleteTask } = useKanbanStore();
   const { onOpen } = useTaskModal();

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

  const handleDelete = () => {
    try {
      deleteTask(task.id, columnId);
      toast.success("Task has been removed successfully");
    } catch (error) {
      console.log("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-describedby="DndDescribedBy-0"
      className="w-full space-y-2 border bg-white p-4 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium">{task.title}</h3>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onOpen("editTask", columnId, task)} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
