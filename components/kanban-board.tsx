"use client";

import { useColumnModal } from "@/hooks/useColumnModal";
import { useKanbanStore } from "@/hooks/useKanbanStore";
import { Plus } from "lucide-react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import KanbanColumn from "./kanban-column";
import TaskCard from "./task-card";
import { Button } from "@/components/ui/button";

const KanbanBoard = () => {
  const { onOpen: onColumnModalOpen } = useColumnModal();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const {
    columns,
    activeTask,
    activeColumn,
    setActiveTask,
    setActiveColumn,
    setColumns,
    moveTask,
    showArchived,
  } = useKanbanStore();

  const visibleColumns = showArchived
    ? columns
    : columns.filter((column) => !column.isArchived);

  const handleOnDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id.toString();

    // Check if we're dragging a column
    if (activeId.includes("column-")) {
      const columnId = activeId.replace("column-", "");
      const column = columns.find((col) => col.id === columnId);
      if (column) {
        setActiveColumn(column);
        return;
      }
    }

    // Otherwise, we're dragging a task
    const taskId = activeId;

    // Find which column contains this task
    for (const column of columns) {
      const task = column.tasks.find((t) => t.id === taskId);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  };

  const handleOnDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Return if the active and over elements are the same
    if (active.id === over.id) return;

    // Handle task dragging
    if (activeTask && !active.id.toString().includes("column-")) {
      // Find the source column (where the active task is from)
      const activeColumn = columns.find((column) =>
        column.tasks.some((task) => task.id === active.id)
      );

      if (!activeColumn) return;

      // Check if this is a task being dragged over a column
      const isTaskOverColumn = over.id.toString().includes("column-");

      if (isTaskOverColumn) {
        // Get the column ID from the over ID
        const overId = over.id.toString().replace("column-", "");

        // If the task is already in this column, do nothing
        if (activeColumn.id === overId) return;

        // Move task between columns
        moveTask(active.id.toString(), activeColumn.id, overId);
      } else {
        // This is a task being dragged over another task
        const overTaskId = over.id as string;

        // Find which column contains the task being dragged over
        const overColumn = columns.find((column) =>
          column.tasks.some((task) => task.id === overTaskId)
        );

        if (!overColumn) return;

        // If tasks are in different columns, move the active task to the over column
        if (activeColumn.id !== overColumn.id) {
          const overTaskIndex = overColumn.tasks.findIndex(
            (task) => task.id === overTaskId
          );
          moveTask(
            active.id.toString(),
            activeColumn.id,
            overColumn.id,
            overTaskIndex
          );
        }
      }
    }
  };

  const handleOnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      setActiveColumn(null);
      return;
    }

    // Handle column reordering
    if (
      active.id.toString().includes("column-") &&
      over.id.toString().includes("column-")
    ) {
      const activeColumnId = active.id.toString().replace("column-", "");
      const overColumnId = over.id.toString().replace("column-", "");

      // If they're the same column, do nothing
      if (activeColumnId === overColumnId) {
        setActiveTask(null);
        setActiveColumn(null);
        return;
      }

      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      // Reorder columns - this will work even with empty columns
      if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
        const newColumns = arrayMove(
          columns,
          activeColumnIndex,
          overColumnIndex
        );
        setColumns(newColumns);
      }
    }
    // Handle task reordering within the same column
    else if (active.id !== over.id && !over.id.toString().includes("column-")) {
      // Find which column contains both tasks
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];

        // Find indices of both tasks
        const activeIndex = column.tasks.findIndex((t) => t.id === active.id);
        const overIndex = column.tasks.findIndex((t) => t.id === over.id);

        // If both tasks are in this column, reorder them
        if (activeIndex !== -1 && overIndex !== -1) {
          const updatedColumn = {
            ...column,
            tasks: arrayMove(column.tasks, activeIndex, overIndex),
          };

          const updatedColumns = [...columns];
          updatedColumns[i] = updatedColumn;

          setColumns(updatedColumns);
          break;
        }
      }
    }

    setActiveTask(null);
    setActiveColumn(null);
  };

  return (
    <div className="h-full min-w-max p-4 space-y-8">
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleOnDragStart}
        onDragOver={handleOnDragOver}
        onDragEnd={handleOnDragEnd}
        sensors={sensors}
      >
        <div className="flex gap-4 pb-4">
          <SortableContext
            items={visibleColumns.map((col) => `column-${col.id}`)}
            strategy={horizontalListSortingStrategy}
          >
            {visibleColumns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                showArchived={showArchived}
              />
            ))}
            <div className="flex-shrink-0 w-[400px] min-h-[405px] h-full border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center">
              <Button
                variant="ghost"
                onClick={() => onColumnModalOpen("createColumn")}
                className="text-gray-500 gap-1.5 hover:cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Column
              </Button>
            </div>
          </SortableContext>
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} columnId={activeColumn?.id as string} />
          ) : activeColumn ? (
            <KanbanColumn column={activeColumn} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
