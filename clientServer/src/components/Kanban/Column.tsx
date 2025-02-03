import { Droppable } from "@hello-pangea/dnd";
import React, { useState } from "react";
import CreateCard from "../../common/CreateCard";
import { mockData } from "../../mock";
import { useUser } from "../../store/UserStore";
import { CardType, ColumnProps, ProjectType } from "../../types";
import Card from "./Card";

const Column: React.FC<ColumnProps> = ({ title, list, id }) => {
  const { selectedIndex: selectedProjectIndex } = useUser();
  // TODO: remove mock data & handle add card & remove "Projects array from here" and get back to me so i can remove the modal from this file
  const [projects, setProjects] = useState<ProjectType[]>(mockData.projects);

  const handleAddCard = (listIndex: number, newCard: CardType) => {
    const updatedProjects = [...projects];
    updatedProjects[selectedProjectIndex].list[listIndex].list.push(newCard);
    setProjects(updatedProjects);
  };
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white  flex flex-col w-[80vw] xs:w-[55vw] sm:w-[40vw] md:w-[30vw] lg:w-[25vw] h-full overflow-y-scroll scrollbar-hide scroll-smooth">
      <h2 className="bg-primary text-white p-2 font-semibold hover:bg-primary bg-primary/70">
        {title}
      </h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            className="flex flex-col gap-2 items-center w-full p-2"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {list.map((card, index) => (
              <Card index={index} card={card} key={card.id} />
            ))}
            {/* {provided.placeholder} */}

            <button
              className="bg-primary text-white p-2 rounded-md"
              onClick={() => {
                setOpen(true);
              }}
            >
              Create New Card
            </button>
            {open && (
              <CreateCard
                onCreate={(newCard: CardType) =>
                  handleAddCard(Number(id), newCard)
                }
                onClose={() => setOpen(false)}
              />
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
