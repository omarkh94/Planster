import { useProject } from "@/store/useProject";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateList from "../../common/CreateList";
import { useKanban } from "../../Context/KanbanContext";
import "../../style/scroll.css";
import { CardListType } from "../../types";
import Column from "./Column";

const KanbanBoard: React.FC = () => {
  const { projects, reorderLists, reorderCards, addListToProject } =
    useKanban();
  const { CreateListModalOpen, setCreateListModalOpen } = useProject();
  const { id } = useParams<{ id: string }>();
  const projectIndex = projects.findIndex((project) => project.id === id);

  useEffect(() => {
    if (projectIndex !== -1) {
      return;
    }
  }, [projectIndex]);

  if (projectIndex === -1) {
    return <div>Project not found.</div>;
  }

  const selectedProject = projects[projectIndex];

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;

    if (type === "list") {
      reorderLists(projectIndex, source.index, destination.index);
    } else {
      const sourceListIndex = parseInt(source.droppableId, 10);
      const destinationListIndex = parseInt(destination.droppableId, 10);
      reorderCards(
        projectIndex,
        sourceListIndex,
        destinationListIndex,
        source.index,
        destination.index
      );
    }
  };

  const handleAddList = (newList: CardListType) => {
    addListToProject(projectIndex, newList);
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center justify-center w-full gap-4 ">
        <h2 className="text-center text-lg md:text-2xl font-semibold pt-2">
          {selectedProject.title}
        </h2>
        <button
          className="self-end text-start px-8  hover:bg-primary bg-primary/70 text-white p-2 rounded-md  font-semibold"
          onClick={() => {
            setCreateListModalOpen(true);
          }}
        >
          + New List
        </button>
      </div>
      <Droppable droppableId="board" type="list" direction="horizontal">
        {(provided) => (
          <div
            className="flex flex-row w-full max-w-screen overflow-x-auto gap-5 scrollbar-hide"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {selectedProject.list.map((listItem, listIndex) => (
              <Draggable
                key={listItem.id}
                draggableId={String(listItem.id)}
                index={listIndex}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="list"
                  >
                    <Column
                      id={String(listIndex)}
                      title={listItem.title}
                      list={listItem.list}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {CreateListModalOpen && <CreateList onCreate={handleAddList} />}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default KanbanBoard;
