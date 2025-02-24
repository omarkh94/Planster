// Column.tsx
import { Droppable } from "@hello-pangea/dnd";
import React, { useState } from "react";
import CreateCard from "../../common/CreateTicket";
import { useKanban } from "../../Context/KanbanContext";
import { ColumnProps } from "../../types";
import Ticket from "./Ticket";

const WorkFlowList: React.FC<ColumnProps> = ({ title, tickets = [], id }) => {
  const { setSelectedTicket } = useKanban();
  const [open, setOpen] = useState(false);
  const { project } = useKanban();

  return (
    <div className="bg-white flex flex-col w-[80vw] xs:w-[55vw] sm:w-[40vw] md:w-[30vw] lg:w-[25vw] h-full overflow-y-scroll scrollbar-hide scroll-smooth">
      <h2 className="bg-primary text-white p-2 font-semibold">{title}</h2>
      <Droppable droppableId={String(id)}>
        {(provided) => (
          <div
            key={id}
            className="flex flex-col gap-2 items-center w-full p-2"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tickets.map((ticket, index) => (
              <Ticket
                index={index}
                ticket={ticket}
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
              />
            ))}
            {provided.placeholder}

            <button
              className="bg-primary text-white p-2 rounded-md"
              onClick={() => setOpen(true)}
            >
              Create New Card
            </button>

            {project?._id && id && open && (
              <CreateCard
                onClose={() => setOpen(false)}
                projectId={project._id}
                listId={id}
              />
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default WorkFlowList;
