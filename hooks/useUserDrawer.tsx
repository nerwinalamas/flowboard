"use client";

import { create } from "zustand";

export type DrawerType = "viewMembers";

type DrawerStore = {
  type: DrawerType | null;
  isOpen: boolean;
  onOpen: (type: DrawerType) => void;
  onClose: () => void;
};

export const useUserDrawer = create<DrawerStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ isOpen: true, type }),
  onClose: () => set({ type: null, isOpen: false }),
}));
