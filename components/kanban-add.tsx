"use client";

import { useTaskModal } from "@/hooks/useTaskModal";
import { useColumnModal } from "@/hooks/useColumnModal";
import { useUserModal } from "@/hooks/useUserModal";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const KanbanAdd = () => {
  const { onOpen: onTaskModalOpen } = useTaskModal();
  const { onOpen: onColumnModalOpen } = useColumnModal();
  const { onOpen: onUserModalOpen } = useUserModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onColumnModalOpen("createColumn")}>
          Column
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onTaskModalOpen("createTask", "todo")}>
          Task
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onUserModalOpen("createUser")}>
          User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KanbanAdd;
