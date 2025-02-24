import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { ProjectType, WorkFlowListType, TicketType } from "../types";
import axios from "axios";

type KanbanContextType = {
  project: ProjectType | null;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  error: string | undefined;
  setError: Dispatch<SetStateAction<string | undefined>>;
  selectedTicket: TicketType | null;
  setProject: (project: ProjectType) => void;
  setSelectedTicket: (ticket: TicketType | null) => void;
  reorderLists: (startIndex: number, endIndex: number) => Promise<void>;
  reorderTickets: (
    listId: string,
    startIndex: number,
    endIndex: number
  ) => Promise<void>;
  moveTicket: (
    sourceListId: string,
    destListId: string,
    sourceIndex: number,
    destIndex: number
  ) => Promise<void>;
  addList: (title: string) => Promise<void>;
  addTicket: (
    listId: string,
    ticketData: { title: string; description: string }
  ) => Promise<void>;
};

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const KanbanProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<{
    project: ProjectType | null;
    selectedTicket: TicketType | null;
  }>({
    project: null,
    selectedTicket: null,
  });
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    setState((prev) => ({
      ...prev,
      error: error.message || "An error occurred",
    }));
  };
  const reorderLists = useCallback(
    async (startIndex: number, endIndex: number) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const lists = Array.from(state.project!.list);
        const [removed] = lists.splice(startIndex, 1);
        lists.splice(endIndex, 0, removed);

        await axios.patch(`/api/projects/${state.project!._id}/lists/order`, {
          listOrder: lists.map((list) => list._id),
        });

        setState((prev) => ({
          ...prev,
          project: { ...prev.project!, list: lists },
        }));
      } catch (error) {
        handleError(error);
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [state.project]
  );

  const reorderTickets = useCallback(
    async (listId: string, startIndex: number, endIndex: number) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const listIndex = state.project!.list.findIndex(
          (l) => l._id === listId
        );
        const tickets = Array.from(
          state.project!.list[listIndex].list
        );
        const [removed] = tickets.splice(startIndex, 1);
        tickets.splice(endIndex, 0, removed);

        await axios.patch(`/api/lists/${listId}/tickets/order`, {
          ticketOrder: tickets.map((ticket) => ticket._id),
        });

        const updatedLists = state.project!.list.map((list) =>
          list._id === listId ? { ...list, tickets } : list
        );

        setState((prev) => ({
          ...prev,
          project: { ...prev.project!, list: updatedLists },
        }));
      } catch (error) {
        handleError(error);
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [state.project]
  );

  const moveTicket = useCallback(
    async (
      sourceListId: string,
      destListId: string,
      sourceIndex: number,
      destIndex: number
    ) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const sourceListIndex = state.project!.list.findIndex(
          (l) => l._id === sourceListId
        );
        const destListIndex = state.project!.list.findIndex(
          (l) => l._id === destListId
        );

        const sourceTickets = [
          ...state.project!.list[sourceListIndex].list,
        ];
        const [movedTicket] = sourceTickets.splice(sourceIndex, 1);

        const destTickets = [
          ...state.project!.list[destListIndex].list,
        ];
        destTickets.splice(destIndex, 0, movedTicket);

        await axios.patch(`/api/tickets/${movedTicket._id}/move`, {
          newListId: destListId,
          newIndex: destIndex,
        });

        const updatedLists = state.project!.list.map((list) => {
          if (list._id === sourceListId)
            return { ...list, tickets: sourceTickets };
          if (list._id === destListId) return { ...list, tickets: destTickets };
          return list;
        });

        setState((prev) => ({
          ...prev,
          project: { ...prev.project!, list: updatedLists },
        }));
      } catch (error) {
        handleError(error);
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [state.project]
  );

  const addList = useCallback(
    async (title: string) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const { data } = await axios.post<WorkFlowListType>(
          `/api/projects/${state.project!._id}/lists`,
          { title }
        );

        setState((prev) => ({
          ...prev,
          project: {
            ...prev.project!,
            list: [...prev.project!.list, data],
          },
        }));
      } catch (error) {
        handleError(error);
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [state.project]
  );

  const addTicket = useCallback(
    async (
      listId: string,
      ticketData: { title: string; description: string }
    ) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const { data } = await axios.post<TicketType>(
          `/api/lists/${listId}/tickets`,
          ticketData
        );

        const updatedLists = state.project!.list.map((list) =>
          list._id === listId
            ? { ...list, tickets: [...list.list, data] }
            : list
        );

        setState((prev) => ({
          ...prev,
          project: { ...prev.project!, list: updatedLists },
        }));
      } catch (error) {
        handleError(error);
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [state.project]
  );

  return (
    <KanbanContext.Provider
      value={{
        project: state.project,
        selectedTicket: state.selectedTicket,
        setProject: (project) => setState((prev) => ({ ...prev, project })),
        setSelectedTicket: (ticket) =>
          setState((prev) => ({ ...prev, selectedTicket: ticket })),
        reorderLists,
        reorderTickets,
        moveTicket,
        addList,
        addTicket,
        error,
        setError,
        loading,
        setLoading,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useKanban = (): KanbanContextType => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
};
