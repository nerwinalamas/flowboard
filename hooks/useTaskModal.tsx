"use client";

import { Task } from "@/lib/schema";
import { create } from "zustand";

export type ModalType = "createTask" | "editTask" | "deleteTask" | "shareTask";

type ModalStore = {
  type: ModalType | null;
  data?: string | Task;
  isOpen: boolean;
  columnId: string;
  onOpen: (type: ModalType, columnId: string, data?: string | Task) => void;
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
