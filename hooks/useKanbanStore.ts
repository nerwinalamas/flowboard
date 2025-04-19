import { create } from "zustand";
import { Column, Task } from "@/lib/schema";
import { initialColumns } from "@/lib/data";

export type Priority = "high" | "medium" | "low";

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
  priorityFilter: Priority[];
  setPriorityFilter: (priorities: Priority[]) => void;
  assigneeFilter: string[];
  setAssigneeFilter: (assignees: string[]) => void;
  getFilteredTasks: (columnId: string) => Task[];
  showUnassigned: boolean;
  setShowUnassigned: (show: boolean) => void;
  toggleUnassigned: () => void;
  archiveTask: (taskId: string, columnId: string) => void;
  unarchiveTask: (taskId: string, columnId: string) => void;
  archiveColumn: (columnId: string) => void;
  unarchiveColumn: (columnId: string) => void;
  showArchived: boolean;
  toggleShowArchived: () => void;
  viewOptions: {
    showDescription: boolean;
    showPriority: boolean;
    showDueDates: boolean;
    showAssignees: boolean;
  };
  setViewOption: <K extends keyof KanbanState["viewOptions"]>(
    option: K,
    value: KanbanState["viewOptions"][K]
  ) => void;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  columns: initialColumns,
  activeTask: null,
  activeColumn: null,
  columnSortDirections: {},
  searchQuery: "",
  priorityFilter: [],
  assigneeFilter: [],
  showUnassigned: false,
  showArchived: false,
  viewOptions: {
    showDescription: true,
    showPriority: true,
    showDueDates: true,
    showAssignees: true,
  },

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

  setAssigneeFilter: (assignees) => set({ assigneeFilter: assignees }),

  setShowUnassigned: (show) => set({ showUnassigned: show }),

  toggleUnassigned: () =>
    set((state) => ({ showUnassigned: !state.showUnassigned })),

  getFilteredTasks: (columnId) => {
    const state = get();
    const column = state.columns.find((col) => col.id === columnId);

    // Return empty array if column doesn't exist or is archived
    if (!column || column.isArchived) return [];

    return column.tasks.filter((task) => {
      // Skip archived tasks unless explicitly enabled
      if (task.isArchived && !state.showArchived) return false;

      // Apply search filter
      const matchesSearch =
        !state.searchQuery ||
        task.title.toLowerCase().includes(state.searchQuery) ||
        task.description.toLowerCase().includes(state.searchQuery);

      // Apply priority filter
      const matchesPriority =
        state.priorityFilter.length === 0 ||
        state.priorityFilter.includes(task.priority);

      // Apply assignee filter
      const matchesAssignee =
        // If no assignee filters are set, show all tasks
        (state.assigneeFilter.length === 0 && !state.showUnassigned) ||
        // Show unassigned tasks if the option is checked
        (state.showUnassigned && !task.assigneeId) ||
        // Show tasks that match the selected assignees
        (state.assigneeFilter.length > 0 &&
          task.assigneeId &&
          state.assigneeFilter.includes(task.assigneeId));

      return matchesSearch && matchesPriority && matchesAssignee;
    });
  },

  archiveTask: (taskId, columnId) => {
    set((state) => ({
      columns: state.columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    isArchived: true,
                    archivedAt: new Date(),
                  }
                : task
            ),
          };
        }
        return column;
      }),
    }));
  },

  unarchiveTask: (taskId, columnId) => {
    set((state) => ({
      columns: state.columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    isArchived: false,
                    archivedAt: undefined,
                  }
                : task
            ),
          };
        }
        return column;
      }),
    }));
  },

  archiveColumn: (columnId) => {
    set((state) => ({
      columns: state.columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              isArchived: true,
              archivedAt: new Date(),
              tasks: column.tasks.map((task) => ({
                ...task,
                isArchived: true,
                archivedAt: new Date(),
              })),
            }
          : column
      ),
    }));
  },

  unarchiveColumn: (columnId) => {
    set((state) => ({
      columns: state.columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              isArchived: false,
              archivedAt: undefined,
              tasks: column.tasks.map((task) => ({
                ...task,
                isArchived: false,
                archivedAt: undefined,
              })),
            }
          : column
      ),
    }));
  },
  
  toggleShowArchived: () =>
    set((state) => ({ showArchived: !state.showArchived })),

  setViewOption: (option, value) =>
    set((state) => ({
      viewOptions: {
        ...state.viewOptions,
        [option]: value,
      },
    })),
}));
