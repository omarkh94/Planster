import CardModal from "@/components/Kanban/CardModal";
import { useProject } from "@/store/useProject";
import React from "react";
import KanbanBoard from "../components/Kanban/KanbanBoard";

const Project: React.FC = () => {
  const { cardModalOpen } = useProject();
  return (
    <div className="px-4">
      <KanbanBoard />
      {cardModalOpen && <CardModal />}
      {/* TODO: add create card modal */}
      {/* {CreateCardModalOpen && <CreateCardModal />} */}
      {/* TODO: add create list modal */}
      {/* {CreateListModalOpen && <CreateList />} */}
    </div>
  );
};

export default Project;
