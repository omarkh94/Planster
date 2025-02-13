import { create } from "zustand";
import { ProjectType } from "../types";
import { projects as mockProjects } from "../mock";

type Store = {
  collapsed: boolean;
  setCollapsed: () => void;
  open: boolean;
  setOpen: () => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  projects: Array<ProjectType>;
  setProjects: (project: ProjectType[]) => void;
  forgottenPassOpen: boolean;
  setForgottenPassOpen: (state: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (IsLoggedIn: boolean) => void;
};

export const useUser = create<Store>()((set) => ({
  collapsed: true,
  setCollapsed: () => set((store) => ({ collapsed: !store.collapsed })),
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" ? true : false,
  setIsLoggedIn: (isLoggedIn) =>
    set(() => {
      localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
      return { isLoggedIn: isLoggedIn };
    }),
  open: false,
  setOpen: () => set((store) => ({ open: !store.open })),
  dialogOpen: false,
  setDialogOpen: (open) => set(() => ({ dialogOpen: open })),
  selectedIndex: 0,
  setSelectedIndex: (index) => set(() => ({ selectedIndex: index })),
  projects: mockProjects,
  setProjects: (project) => set(() => ({ projects: project })),
  forgottenPassOpen: false,
  setForgottenPassOpen: (state) => set(() => ({ forgottenPassOpen: state })),
}));
