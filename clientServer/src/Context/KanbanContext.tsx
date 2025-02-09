import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProjectType, WorkFlowListType, TicketType } from "../types";
import { mockData } from "../mock";


interface KanbanContextType {
  projects: ProjectType[];
  reorderLists: (projectIndex: number, sourceIndex: number, destinationIndex: number) => void;
  reorderTickets: (projectIndex: number, sourceListIndex: number, destinationListIndex: number, sourceIndex: number, destinationIndex: number) => void;
  addListToProject: (projectIndex: number, newList: WorkFlowListType) => void;
  addTicketToList: (projectIndex: number, listIndex: number, newCard: TicketType) => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const KanbanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectType[]>(mockData.projects);

  const reorderLists = (projectIndex: number, sourceIndex: number, destinationIndex: number) => {
    const updatedProjects = [...projects];
    const project = updatedProjects[projectIndex];
    const [movedList] = project.list.splice(sourceIndex, 1);
    project.list.splice(destinationIndex, 0, movedList);
    setProjects(updatedProjects);
  };

  const reorderTickets = (projectIndex: number, sourceListIndex: number, destinationListIndex: number, sourceIndex: number, destinationIndex: number) => {
    const updatedProjects = [...projects];
    const sourceList = updatedProjects[projectIndex].list[sourceListIndex];
    const destinationList = updatedProjects[projectIndex].list[destinationListIndex];
    const [movedCard] = sourceList.list.splice(sourceIndex, 1);
    destinationList.list.splice(destinationIndex, 0, movedCard);
    setProjects(updatedProjects);
  };

  const addListToProject = (projectIndex: number, newList: WorkFlowListType) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].list.push(newList);
    setProjects(updatedProjects);
  };

  const addTicketToList = (projectIndex: number, listIndex: number, newTicket: TicketType) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].list[listIndex].list.push(newTicket);
    setProjects(updatedProjects);
  };

  return (
    <KanbanContext.Provider value={{ projects, reorderLists, reorderTickets, addListToProject, addTicketToList }}>
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
