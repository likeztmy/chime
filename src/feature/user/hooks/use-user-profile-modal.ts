import { create } from "zustand";

interface UserProfileModalStore {
  isOpen: boolean;
  selectedUserId: number | null;
  setIsOpen: (open: boolean) => void;
  setSelectedUserId: (userId: number | null) => void;
  open: (userId: number) => void;
  close: () => void;
}

export const useUserProfileModal = create<UserProfileModalStore>((set) => ({
  isOpen: false,
  selectedUserId: null,
  setIsOpen: (open) => set({ isOpen: open }),
  setSelectedUserId: (userId) => set({ selectedUserId: userId }),
  open: (userId) => set({ isOpen: true, selectedUserId: userId }),
  close: () => set({ isOpen: false, selectedUserId: null }),
}));
