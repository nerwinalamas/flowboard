"use client";

import { Task } from "@/lib/schema";
import { getInitials } from "@/lib/utils";
import { useTaskModal } from "@/hooks/useTaskModal";
import { useKanbanStore } from "@/hooks/useKanbanStore";
import { useUserStore } from "@/hooks/useUserStore";
import {
  Archive,
  ArchiveX,
  Clock,
  Copy,
  Pencil,
  Share2,
  Trash2,
  User,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import KanbanDropdownMenu, { DropdownMenuItem } from "./kanban-dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TaskCardProps {
  task: Task;
  columnId: string;
  showArchived?: boolean;
}

const TaskCard = ({ task, columnId, showArchived }: TaskCardProps) => {
  const { onOpen } = useTaskModal();

  const duplicateTask = useKanbanStore((state) => state.duplicateTask);
  const archiveTask = useKanbanStore((state) => state.archiveTask);
  const viewOptions = useKanbanStore((state) => state.viewOptions);
  const unarchiveTask = useKanbanStore((state) => state.unarchiveTask);
  const users = useUserStore((state) => state.users);

  const assignedUser = task.assigneeId
    ? users.find((user) => user.id === task.assigneeId)
    : null;
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : null;

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

  const handleArchiveTask = (taskId: string, columnId: string) => {
    try {
      archiveTask(taskId, columnId);

      toast.success("Task archived successfully");
    } catch (error) {
      console.log("Error archiving task:", error);
      toast.error("Failed to archive task");
    }
  };

  const handleUnarchiveTask = (taskId: string, columnId: string) => {
    try {
      unarchiveTask(taskId, columnId);

      toast.success("Task archived successfully");
    } catch (error) {
      console.log("Error archiving task:", error);
      toast.error("Failed to archive task");
    }
  };

  const DROPDOWN_MENU_ITEMS: DropdownMenuItem[] = task.isArchived
    ? [
        {
          label: "Unarchive",
          icon: ArchiveX,
          onClick: () => handleUnarchiveTask(task.id, columnId),
        },
        {
          label: "Delete",
          icon: Trash2,
          onClick: () => onOpen("deleteTask", columnId, task),
          className: "text-red-600 focus:text-red-600",
        },
      ]
    : [
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
          label: "Share",
          icon: Share2,
          onClick: () => onOpen("shareTask", columnId, task),
        },
        {
          label: "Archive",
          icon: Archive,
          onClick: () => handleArchiveTask(task.id, columnId),
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
        <div>
          {task.isArchived && showArchived && (
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <Archive className="h-3 w-3 mr-1" />
              <span>Archived</span>
            </div>
          )}
          <h3 className="font-medium">{task.title}</h3>
        </div>
        <KanbanDropdownMenu items={DROPDOWN_MENU_ITEMS} />
      </div>

      {viewOptions.showDescription && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      )}

      {viewOptions.showPriority && (
        <Badge
          className={
            priorityColors[task.priority as keyof typeof priorityColors]
          }
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
      )}

      {(viewOptions.showAssignees || viewOptions.showDueDates) && (
        <div className="grid grid-cols-2 text-xs mt-1 text-gray-500">
          {viewOptions.showAssignees && (
            <div className="flex items-center">
              {assignedUser ? (
                <>
                  <Avatar className="h-5 w-5 mr-1">
                    <AvatarFallback className="text-[10px]">
                      {getInitials(assignedUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="capitalize">{assignedUser.name}</span>
                </>
              ) : (
                <>
                  <User className="h-3 w-3 mr-1" />
                  <span>Unassigned</span>
                </>
              )}
            </div>
          )}

          {viewOptions.showDueDates && task.dueDate && (
            <div className="flex items-center justify-end col-start-2">
              <Clock className="h-3 w-3 mr-1" />
              {formattedDueDate}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
