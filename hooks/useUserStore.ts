import { create } from "zustand";
import { User } from "@/lib/schema";
import { sampleUsers } from "@/lib/data";

interface UserState {
  users: User[];
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: sampleUsers,
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
    })),
}));
