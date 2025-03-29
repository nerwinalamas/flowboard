"use client";

import { Column } from "@/lib/schema";
import { create } from "zustand";

export type ModalType = "createColumn" | "editColumn" | "deleteColumn";

type ModalStore = {
  type: ModalType | null;
  data?: string | Column;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: string | Column) => void;
  onClose: () => void;
};

export const useColumnModal = create<ModalStore>((set) => ({
  type: null,
  data: undefined,
  isOpen: false,
  columnId: "todo",
  onOpen: (type, data) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, data: undefined, isOpen: false }),
}));
