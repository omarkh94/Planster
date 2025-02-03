import { useProject } from "@/store/useProject";
import { CardType } from "@/types";
import { Draggable } from "@hello-pangea/dnd";
import { Avatar } from "antd";
import React from "react";

type CardProps = {
  card: CardType;
  index: number;
};

const Card: React.FC<CardProps> = ({ card, index }) => {
  const { setCardModalOpen, setSelectedCard } = useProject();
  const handleClick = () => {
    setCardModalOpen(true);
    setSelectedCard(card);
  };
  return (
    <Draggable draggableId={String(card.id)} key={card.id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={handleClick}
            className={`
            bg-secondary  w-full p-2 h-32 text-black font-glory rounded-md flex flex-col justify-between cursor-pointer
            ${snapshot.isDragging ? `opacity-50` : ""}
            `}
          >
            <span className="font-semibold uppercase">
              <small>#{card.id} </small>
            </span>
            <h2 className="self-center">{card.title}</h2>
            <div className="flex justify-end">
              <Avatar src={"https://joesch.moe/api/v1/random?key=" + card.id} />
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Card;
