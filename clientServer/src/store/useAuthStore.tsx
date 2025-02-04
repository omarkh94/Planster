import { create } from "zustand";

type Store = {
  registerModalOpen: boolean;
  setRegisterModalOpen: (state: boolean) => void;
};

export const useAuthStore = create<Store>()((set) => ({
  registerModalOpen: false,
  setRegisterModalOpen: (state) => set(() => ({ registerModalOpen: state })),
}));
