"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { ProjectType, TicketType } from "../types";
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
  reorderLists: (startIndex: number, endIndex: number) => Promise<ProjectType>;
  reorderTickets: (
    listId: string,
    startIndex: number,
    endIndex: number
  ) => Promise<ProjectType>;
  moveTicket: (
    sourceListId: string,
    destListId: string,
    sourceIndex: number,
    destIndex: number
  ) => Promise<ProjectType>;
  updateProject: (updatedProject: ProjectType) => Promise<void>;
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
  const handleError = useCallback((error: any) => {
    setError(error.message || "An error occurred");
  }, []);

  const reorderLists = useCallback(
    async (startIndex: number, endIndex: number): Promise<ProjectType> => {
      setLoading(true);
      try {
        if (!state.project || !Array.isArray(state.project.list)) {
          throw new Error("Project or list is not properly defined");
        }

        const lists = Array.from(state.project.list);
        const [removedList] = lists.splice(startIndex, 1);
        lists.splice(endIndex, 0, removedList);

        const updatedProject = { ...state.project, list: lists };
        setState((prev) => ({ ...prev, project: updatedProject }));
        return updatedProject;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [state.project, handleError]
  );
  const reorderTickets = useCallback(
    async (
      listId: string,
      startIndex: number,
      endIndex: number
    ): Promise<ProjectType> => {
      setLoading(true);
      try {
        if (!state.project || !Array.isArray(state.project.list)) {
          throw new Error("Project or list is not properly defined");
        }

        const listIndex = state.project.list.findIndex((l) => l._id == listId);
        if (listIndex === -1) {
          throw new Error(`List with id ${listId} not found`);
        }

        const currentList = state.project.list[listIndex];
        if (!currentList || !Array.isArray(currentList.list)) {
          throw new Error(
            `List ${listId} is not properly defined or doesn't have a 'list' property`
          );
        }

        const tickets = Array.from(currentList.list);
        const [removed] = tickets.splice(startIndex, 1);
        tickets.splice(endIndex, 0, removed);

        const updatedLists = state.project.list.map((list) =>
          list._id === listId ? { ...list, list: tickets } : list
        );

        const updatedProject = { ...state.project, list: updatedLists };
        setState((prev) => ({ ...prev, project: updatedProject }));
        return updatedProject;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [state.project, handleError]
  );

  const moveTicket = useCallback(
    async (
      sourceListId: string,
      destListId: string,
      sourceIndex: number,
      destIndex: number
    ): Promise<ProjectType> => {
      setLoading(true);
      try {
        const sourceListIndex = state.project!.list.findIndex(
          (l) => l._id === sourceListId
        );
        const destListIndex = state.project!.list.findIndex(
          (l) => l._id === destListId
        );

        const sourceTickets = [...state.project!.list[sourceListIndex].list];
        const [movedTicket] = sourceTickets.splice(sourceIndex, 1);

        const destTickets = [...state.project!.list[destListIndex].list];
        destTickets.splice(destIndex, 0, movedTicket);

        const updatedLists = state.project!.list.map((list) => {
          if (list._id === sourceListId)
            return { ...list, list: sourceTickets };
          if (list._id === destListId) return { ...list, list: destTickets };
          return list;
        });

        const updatedProject = { ...state.project!, list: updatedLists };
        setState((prev) => ({ ...prev, project: updatedProject }));
        return updatedProject;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [state.project, handleError]
  );

  const updateProject = useCallback(
    async (updatedProject: ProjectType) => {
      setState((prev) => ({ ...prev, updatedProject }));
      console.log("updatedProject :>> ", updatedProject);
      try {
        await axios.put(
          `${import.meta.env.VITE_APP_API_URL}/projects/update/${
            updatedProject._id
          }`,
          {
            updatedProject: updatedProject,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
      } catch (error) {
        handleError(error);
      }
    },
    [handleError]
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
        updateProject,
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
