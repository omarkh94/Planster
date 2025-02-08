import { create } from "zustand";

type Store = {
  registerModalOpen: boolean;
  setRegisterModalOpen: (state: boolean) => void;
  loginModalOpen: boolean;
  setLoginModalOpen: (state: boolean) => void;
  profileModalOpen: boolean;
  setProfileModalOpen: (state: boolean) => void;
};

export const useAuthStore = create<Store>()((set) => ({
  registerModalOpen: false,
  setRegisterModalOpen: (state) => set(() => ({ registerModalOpen: state })),
  loginModalOpen: false,
  setLoginModalOpen: (state) => set(() => ({ loginModalOpen: state })),
  profileModalOpen: false,
  setProfileModalOpen: (state) => set(() => ({ profileModalOpen: state })),
}));
