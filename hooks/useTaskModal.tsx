import { create } from "zustand";

export type ModalType = "createTask";

type ColumnType = "todo" | "in-progress" | "done";

type ModalStore = {
  type: ModalType | null;
  data?: string;
  isOpen: boolean;
  columnId: ColumnType;
  onOpen: (type: ModalType, columnId: ColumnType, data?: string) => void;
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
