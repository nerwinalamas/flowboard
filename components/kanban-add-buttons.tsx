"use client";

import { Button } from "@/components/ui/button";
import { useColumnModal } from "@/hooks/useColumnModal";
import { useTaskModal } from "@/hooks/useTaskModal";
import { Plus } from "lucide-react";

const KanbanAddButtons = () => {
  const { onOpen: onTaskModalOpen } = useTaskModal();
  const { onOpen: onColumnModalOpen } = useColumnModal();

  return (
    <div className="flex flex-col gap-2 md:flex-row md:justify-end md:items-center">
      <Button
        variant="outline"
        onClick={() => onColumnModalOpen("createColumn")}
        className="cursor-pointer"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Column
      </Button>
      <Button
        onClick={() => onTaskModalOpen("createTask", "todo")}
        className="cursor-pointer"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Task
      </Button>
    </div>
  );
};

export default KanbanAddButtons;
