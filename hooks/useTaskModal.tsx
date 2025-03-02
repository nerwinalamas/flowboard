import { create } from "zustand";

export type ModalType = "createTask";

type ModalStore = {
  type: ModalType | null;
  data?: string;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: string) => void;
  onClose: () => void;
};

export const useTaskModal = create<ModalStore>((set) => ({
  type: null,
  data: undefined,
  isOpen: false,
  onOpen: (type, data) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, data: undefined, isOpen: false }),
}));
