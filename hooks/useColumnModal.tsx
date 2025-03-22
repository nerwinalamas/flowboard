"use client";

import { create } from "zustand";

export type ModalType = "createColumn";

type ModalStore = {
  type: ModalType | null;
  data?: string;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: string) => void;
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
