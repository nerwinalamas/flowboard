import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskCard from "./task-card";
import { Column } from "@/lib/types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTaskModal } from "@/hooks/useTaskModal";

interface KanbanColumnProps {
  column: Column;
}

const KanbanColumn = ({ column }: KanbanColumnProps) => {
  const { onOpen } = useTaskModal();
  const { setNodeRef } = useDroppable({
    id: `column-${column.id}`,
  });

  return (
    <div className="h-full bg-gray-100 w-[320px] md:w-[380px] xl:w-1/3 space-y-4 p-4 rounded-lg mx-2">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">
          {column.title}{" "}
          <span className="ml-2 text-muted-foreground text-sm">
            ({column.tasks.length})
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onOpen("createTask")} className="hover:bg-primary/10 cursor-pointer">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className="space-y-3 min-h-[200px] p-2 rounded-md border border-dashed border-gray-300 transition-colors duration-200 hover:border-gray-400"
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
            column.tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
