import { create } from "zustand";
import { User } from "@/lib/schema";

interface UserState {
  users: User[];
  addUser: (user: User) => void;
}

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

export const useUserStore = create<UserState>((set) => ({
  users: sampleUsers,
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
}));
