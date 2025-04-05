import { create } from "zustand";
import { Column, Task } from "@/lib/schema";

export type Priority = "all" | "high" | "medium" | "low";

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
  editColumn: (columnId: string, updatedColumn: Partial<Column>) => void;
  deleteColumn: (columnId: string) => void;
  duplicateColumn: (columnId: string) => void;
  duplicateTask: (taskId: string, columnId: string) => void;
  columnSortDirections: Record<string, "high-to-low" | "low-to-high">;
  togglePrioritySort: (columnId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priorityFilter: Priority;
  setPriorityFilter: (priority: Priority) => void;
  getFilteredTasks: (columnId: string) => Task[];
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

export const useKanbanStore = create<KanbanState>((set, get) => ({
  columns: initialColumns,
  activeTask: null,
  activeColumn: null,
  columnSortDirections: {},
  searchQuery: "",
  priorityFilter: "all",

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

  editColumn: (columnId, updatedColumn) => {
    set((state) => {
      const updatedColumns = state.columns.map((column) => {
        if (column.id === columnId) {
          return { ...column, ...updatedColumn };
        }
        return column;
      });

      return { columns: updatedColumns };
    });
  },

  deleteColumn: (columnId) => {
    set((state) => ({
      columns: state.columns.filter((column) => column.id !== columnId),
    }));
  },

  duplicateColumn: (columnId) => {
    set((state) => {
      // Find the column to duplicate
      const columnToDuplicate = state.columns.find(
        (col) => col.id === columnId
      );
      if (!columnToDuplicate) return state;

      // Create a deep copy of the column
      const duplicatedColumn: Column = {
        ...columnToDuplicate,
        id: `${columnToDuplicate.id}-copy-${Date.now()}`, // Generate a unique ID
        title: `${columnToDuplicate.title} (Copy)`,
        tasks: columnToDuplicate.tasks.map((task) => ({
          ...task,
          id: `${task.id}-copy-${Date.now()}`, // Generate unique IDs for tasks
        })),
      };

      // Insert the duplicated column right after the original
      const originalIndex = state.columns.findIndex(
        (col) => col.id === columnId
      );
      const newColumns = [...state.columns];
      newColumns.splice(originalIndex + 1, 0, duplicatedColumn);

      return { columns: newColumns };
    });
  },

  duplicateTask: (taskId, columnId) => {
    set((state) => {
      // Find the column
      const column = state.columns.find((col) => col.id === columnId);
      if (!column) return state;

      // Find the task to duplicate
      const taskToDuplicate = column.tasks.find((t) => t.id === taskId);
      if (!taskToDuplicate) return state;

      const duplicatedTask: Task = {
        ...taskToDuplicate,
        id: `task-copy-${Date.now()}`,
        title: `${taskToDuplicate.title} (Copy)`,
      };

      const updatedColumns = state.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [...col.tasks, duplicatedTask],
          };
        }
        return col;
      });

      return { columns: updatedColumns };
    });
  },

  togglePrioritySort: (columnId) => {
    set((state) => {
      const currentDirection =
        state.columnSortDirections[columnId] || "high-to-low";
      const newDirection =
        currentDirection === "high-to-low" ? "low-to-high" : "high-to-low";

      const priorityOrder = {
        "high-to-low": { high: 1, medium: 2, low: 3 },
        "low-to-high": { low: 1, medium: 2, high: 3 },
      };

      const updatedColumns = state.columns.map((column) => {
        if (column.id === columnId) {
          const sortedTasks = [...column.tasks].sort((a, b) => {
            return (
              priorityOrder[newDirection][a.priority] -
              priorityOrder[newDirection][b.priority]
            );
          });
          return { ...column, tasks: sortedTasks };
        }
        return column;
      });

      return {
        columns: updatedColumns,
        columnSortDirections: {
          ...state.columnSortDirections,
          [columnId]: newDirection,
        },
      };
    });
  },

  setSearchQuery: (query) => set({ searchQuery: query.toLowerCase() }),

  setPriorityFilter: (priority) => set({ priorityFilter: priority }),

  getFilteredTasks: (columnId) => {
    const state = get();
    const column = state.columns.find((col) => col.id === columnId);
    if (!column) return [];

    return column.tasks.filter((task) => {
      // Apply search filter
      const matchesSearch =
        !state.searchQuery ||
        task.title.toLowerCase().includes(state.searchQuery) ||
        task.description.toLowerCase().includes(state.searchQuery);

      // Apply priority filter
      const matchesPriority =
        state.priorityFilter === "all" ||
        task.priority === state.priorityFilter;

      return matchesSearch && matchesPriority;
    });
  },
}));
