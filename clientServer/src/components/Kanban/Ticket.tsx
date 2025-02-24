import { useProject } from "@/store/useProject";
import { TicketType } from "@/types";
import { Draggable } from "@hello-pangea/dnd";
import { Avatar } from "antd";

// type TicketProps = {
//   ticket: TicketType;
//   index: number;
//   onClick: () => void;
// };

const Ticket = ({ ticket, index, onClick }: { 
  ticket: TicketType; 
  index: number;
  onClick: () => void;
}) => {
  
  const { setCardModalOpen: setTicketModalOpen, setSelectedCard: setSelectedTicket } = useProject();
  if (!ticket) return null;

  if (!ticket) {
    console.error("Ticket is undefined.");
    return null; 
  }

  const handleClick = () => {
    setTicketModalOpen(true);
    setSelectedTicket(ticket);
  };


    



  return (
    <Draggable draggableId={String(ticket._id)} index={index}>
      {(provided, snapshot) => {
        return (



          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={() => {
              handleClick();
              onClick?.(); 
            }}
            
            
            
            
            className={`
              bg-secondary w-full p-2 h-32 text-black font-glory rounded-md flex flex-col justify-between cursor-pointer
              ${snapshot.isDragging ? `opacity-50` : ""}
            `}
          >
            <span className="font-semibold uppercase">
              <small>#{ticket.id} </small>
            </span>
            <h2 className="self-center">{ticket.title}</h2>
            <div className="flex justify-end">
              <Avatar src={"https://joesch.moe/api/v1/random?key=" + ticket._id} />
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Ticket;



