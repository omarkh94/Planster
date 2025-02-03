import { CardType } from "@/types";
import { create } from "zustand";

type Store = {
  cardModalOpen: boolean;
  setCardModalOpen: (open: boolean) => void;
  CreateCardModalOpen: boolean;
  setCreateCardModalOpen: (open: boolean) => void;
  CreateListModalOpen: boolean;
  setCreateListModalOpen: (open: boolean) => void;
  selectedCard: CardType | null;
  setSelectedCard: (card: CardType | null) => void;
};

export const useProject = create<Store>()((set) => ({
  cardModalOpen: false,
  setCardModalOpen: (open) => set(() => ({ cardModalOpen: open })),
  CreateCardModalOpen: false,
  setCreateCardModalOpen: (open) => set(() => ({ CreateCardModalOpen: open })),
  CreateListModalOpen: false,
  setCreateListModalOpen: (open) => set(() => ({ CreateListModalOpen: open })),
  selectedCard: null,
  setSelectedCard: (card) => set(() => ({ selectedCard: card })),
}));
