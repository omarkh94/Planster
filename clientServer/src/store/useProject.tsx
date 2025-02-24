/* eslint-disable @typescript-eslint/no-explicit-any */
import {  TicketType } from "@/types";
import { create } from "zustand";

type Store = {
  projects: any;
  setProjects: (project: any) => void;
  cardModalOpen: boolean;
  setCardModalOpen: (open: boolean) => void;
  CreateCardModalOpen: boolean;
  setCreateCardModalOpen: (open: boolean) => void;
  CreateListModalOpen: boolean;
  setCreateListModalOpen: (open: boolean) => void;
  selectedCard: TicketType | null;
  setSelectedCard: (card: TicketType | null) => void;
};

export const useProject = create<Store>()((set) => ({
  projects: [],
  setProjects: (projects) => set(() => ({ projects })),
  cardModalOpen: false,
  setCardModalOpen: (open) => set(() => ({ cardModalOpen: open })),
  CreateCardModalOpen: false,
  setCreateCardModalOpen: (open) => set(() => ({ CreateCardModalOpen: open })),
  CreateListModalOpen: false,
  setCreateListModalOpen: (open) => set(() => ({ CreateListModalOpen: open })),
  selectedCard: null,
  setSelectedCard: (card) => set(() => ({ selectedCard: card })),
}));
