import { Column, User } from "./schema";

export const initialColumns: Column[] = [
  {
    id: "todo",
    title: "Todo",
    isArchived: false,
    archivedAt: undefined,
    tasks: [
      {
        id: "1",
        title: "Research competitors",
        description: "Look into what our competitors are doing",
        priority: "medium",
        assigneeId: undefined,
        dueDate: new Date("2025-04-30"),
        isArchived: false,
        archivedAt: undefined,
      },
      {
        id: "2",
        title: "Design new landing page",
        description: "Create wireframes for the new landing page",
        priority: "high",
        assigneeId: undefined,
        dueDate: new Date("2025-04-30"),
        isArchived: false,
        archivedAt: undefined,
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    isArchived: false,
    archivedAt: undefined,
    tasks: [
      {
        id: "3",
        title: "Implement authentication",
        description: "Add login and registration functionality",
        priority: "high",
        assigneeId: "1",
        dueDate: new Date("2025-04-20"),
        isArchived: false,
        archivedAt: undefined,
      },
      {
        id: "4",
        title: "Write documentation",
        description: "Document the API endpoints",
        priority: "low",
        assigneeId: "3",
        dueDate: new Date("2025-04-15"),
        isArchived: false,
        archivedAt: undefined,
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    isArchived: false,
    archivedAt: undefined,
    tasks: [
      {
        id: "5",
        title: "Setup project repository",
        description: "Initialize Git repo and configure CI/CD",
        priority: "medium",
        assigneeId: "1",
        dueDate: new Date("2025-04-05"),
        isArchived: false,
        archivedAt: undefined,
      },
      {
        id: "6",
        title: "Create database schema",
        description: "Design and implement the initial database schema",
        priority: "high",
        assigneeId: "2",
        dueDate: new Date("2025-04-10"),
        isArchived: false,
        archivedAt: undefined,
      },
    ],
  },
];

export const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Jane Smith",
  },
  {
    id: "3",
    name: "Robert Johnson",
  },
  {
    id: "4",
    name: "Emily Davis",
  },
];
