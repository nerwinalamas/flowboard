import { create } from "zustand";
import { Column, Task } from "@/lib/schema";

interface KanbanState {
  columns: Column[];
  activeTask: Task | null;
  activeColumn: Column | null;
  setActiveTask: (task: Task | null) => void;
  setActiveColumn: (column: Column | null) => void;
  setColumns: (columns: Column[]) => void;
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    index?: number
  ) => void;
  moveColumn: (sourceIndex: number, destinationIndex: number) => void;
  addTask: (columnId: string, task: Task) => void;
  deleteTask: (taskId: string, columnId: string) => void;
  editTask: (
    taskId: string,
    columnId: string,
    updatedTask: Partial<Task>
  ) => void;
  addColumn: (column: Column) => void;
}

// Initial columns data
const initialColumns: Column[] = [
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
];

export const useKanbanStore = create<KanbanState>((set) => ({
  columns: initialColumns,
  activeTask: null,
  activeColumn: null,

  setActiveTask: (task) => set({ activeTask: task }),

  setActiveColumn: (column) => set({ activeColumn: column }),

  setColumns: (columns) => set({ columns }),

  moveTask: (taskId, sourceColumnId, destinationColumnId, index) => {
    set((state) => {
      // Find the source and destination columns
      const sourceColumn = state.columns.find(
        (col) => col.id === sourceColumnId
      );
      const destinationColumn = state.columns.find(
        (col) => col.id === destinationColumnId
      );

      if (!sourceColumn || !destinationColumn) return state;

      // Find the task in the source column
      const task = sourceColumn.tasks.find((t) => t.id === taskId);
      if (!task) return state;

      // Remove the task from the source column
      const updatedSourceTasks = sourceColumn.tasks.filter(
        (t) => t.id !== taskId
      );

      // Add the task to the destination column
      let updatedDestinationTasks;
      if (typeof index === "number") {
        // Insert at specific index
        updatedDestinationTasks = [...destinationColumn.tasks];
        updatedDestinationTasks.splice(index, 0, task);
      } else {
        // Add to the end
        updatedDestinationTasks = [...destinationColumn.tasks, task];
      }

      // Update the columns
      const updatedColumns = state.columns.map((col) => {
        if (col.id === sourceColumnId) {
          return { ...col, tasks: updatedSourceTasks };
        }
        if (col.id === destinationColumnId) {
          return { ...col, tasks: updatedDestinationTasks };
        }
        return col;
      });

      return { columns: updatedColumns };
    });
  },

  moveColumn: (sourceIndex, destinationIndex) => {
    set((state) => {
      const newColumns = [...state.columns];
      const [movedColumn] = newColumns.splice(sourceIndex, 1);
      newColumns.splice(destinationIndex, 0, movedColumn);
      return { columns: newColumns };
    });
  },

  addTask: (columnId, taskData) => {
    set((state) => {
      const updatedColumns = state.columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: [...column.tasks, taskData],
          };
        }
        return column;
      });

      return { columns: updatedColumns };
    });
  },

  deleteTask: (taskId, columnId) => {
    set((state) => {
      const updatedColumns = state.columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          };
        }
        return column;
      });

      return { columns: updatedColumns };
    });
  },

  editTask: (taskId, columnId, updatedTask) => {
    set((state) => {
      const updatedColumns = state.columns.map((column) => {
        if (column.id === columnId) {
          const updatedTasks = column.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, ...updatedTask };
            }
            return task;
          });

          return { ...column, tasks: updatedTasks };
        }
        return column;
      });

      return { columns: updatedColumns };
    });
  },

  addColumn: (column) => {
    set((state) => ({
      columns: [...state.columns, column],
    }));
  },
}));
