import TicketModal from "@/components/Kanban/TicketModal";
import { useProject } from "@/store/useProject";
import React from "react";
import KanbanBoard from "../components/Kanban/KanbanBoard";
import { KanbanProvider } from "@/Context/KanbanContext";

const Project: React.FC = () => {
  const { cardModalOpen } = useProject();
  return (
    <KanbanProvider>
      <div className="px-4">
        <KanbanBoard />

        {cardModalOpen && <TicketModal />}
      </div>
    </KanbanProvider>
  );
};
export default Project;
