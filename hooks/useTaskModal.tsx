"use client";

import { Task } from "@/lib/schema";
import { create } from "zustand";

export type ModalType = "createTask" | "editTask";

export type ColumnType = "todo" | "in-progress" | "done";

type ModalStore = {
  type: ModalType | null;
  data?: string | Task;
  isOpen: boolean;
  columnId: ColumnType;
  onOpen: (type: ModalType, columnId: ColumnType, data?: string | Task) => void;
  onClose: () => void;
};

export const useTaskModal = create<ModalStore>((set) => ({
  type: null,
  data: undefined,
  isOpen: false,
  columnId: "todo",
  onOpen: (type, columnId, data) => set({ isOpen: true, type, columnId, data }),
  onClose: () => set({ type: null, data: undefined, isOpen: false }),
}));
