"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTaskModal } from "@/hooks/useTaskModal";
import KanbanColumn from "./kanban-column";
import { Column, Task } from "@/lib/types";
import { useState } from "react";
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
import TaskCard from "./task-card";

const KanbanBoard = () => {
  const { onOpen } = useTaskModal();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "Todo",
      tasks: [
        {
          id: "1",
          title: "Research competitors",
          description: "Look into what our competitors are doing",
          priority: "medium",
        },
        {
          id: "2",
          title: "Design new landing page",
          description: "Create wireframes for the new landing page",
          priority: "high",
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: [
        {
          id: "3",
          title: "Implement authentication",
          description: "Add login and registration functionality",
          priority: "high",
        },
        {
          id: "4",
          title: "Write documentation",
          description: "Document the API endpoints",
          priority: "low",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        {
          id: "5",
          title: "Setup project repository",
          description: "Initialize Git repo and configure CI/CD",
          priority: "medium",
        },
        {
          id: "6",
          title: "Create database schema",
          description: "Design and implement the initial database schema",
          priority: "high",
        },
      ],
    },
  ]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const handleOnDragStart = (event: DragStartEvent) => {
    const { active } = event;

    const activeId = active.id as string;

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

    if (!over || !activeTask) return;

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

        // Create updated columns by removing task from source and adding to destination
        const updatedColumns = columns.map((col) => {
          // Remove task from all columns
          const filteredTasks = col.tasks.filter((t) => t.id !== activeTask.id);

          // If this is the destination column, add the task
          if (col.id === overId) {
            return {
              ...col,
              tasks: [...filteredTasks, activeTask],
            };
          }

          return {
            ...col,
            tasks: filteredTasks,
          };
        });

        setColumns(updatedColumns);
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
          const updatedColumns = columns.map((col) => {
            // Remove the active task from its current column
            if (col.id === activeColumn.id) {
              return {
                ...col,
                tasks: col.tasks.filter((task) => task.id !== activeTask.id),
              };
            }

            // Add the active task to the target column at the specific position
            if (col.id === overColumn.id) {
              const overTaskIndex = col.tasks.findIndex(
                (task) => task.id === overTaskId
              );
              const newTasks = [...col.tasks];
              newTasks.splice(overTaskIndex, 0, activeTask);

              return {
                ...col,
                tasks: newTasks,
              };
            }

            return col;
          });

          setColumns(updatedColumns);
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

      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      // Reorder columns
      if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
        setColumns(arrayMove(columns, activeColumnIndex, overColumnIndex));
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
          const updatedColumns = [...columns];
          updatedColumns[i] = {
            ...column,
            tasks: arrayMove(column.tasks, activeIndex, overIndex),
          };

          setColumns(updatedColumns);
          break;
        }
      }
    }

    setActiveTask(null);
    setActiveColumn(null);
  };

  return (
    <div className="h-full min-w-max space-y-4 p-4">
      <div className="flex justify-end">
        <Button onClick={() => onOpen("createTask")} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Add New Task
        </Button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleOnDragStart}
        onDragOver={handleOnDragOver}
        onDragEnd={handleOnDragEnd}
        sensors={sensors}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          <SortableContext
            items={columns.map((col) => `column-${col.id}`)}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} />
          ) : activeColumn ? (
            <div className="w-[400px] h-full bg-gray-100 space-y-4 p-4 rounded-lg opacity-80">
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium">
                  {activeColumn.title}{" "}
                  <span className="ml-2 text-muted-foreground text-sm">
                    ({activeColumn.tasks.length})
                  </span>
                </div>
              </div>
              <div className="space-y-3 min-h-[200px] p-2 rounded-md border border-dashed border-gray-300">
                {activeColumn.tasks.length === 0 ? (
                  <div className="flex h-24 items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      No tasks yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeColumn.tasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
