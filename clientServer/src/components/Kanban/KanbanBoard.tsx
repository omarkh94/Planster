import { useProject } from "@/store/useProject";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import React, { useCallback, useEffect } from "react";
import CreateList from "../../common/CreateList";
import { useKanban } from "../../Context/KanbanContext";
import WorkFlowList from "./WorkFlowList";
import { useParams } from "react-router-dom";
import axios from "axios";

const KanbanBoard: React.FC = () => {
  const {
    project,
    setProject,
    loading,
    error,
    setError,
    setLoading,
    reorderLists,
    reorderTickets,
    moveTicket,
    updateProject,
  } = useKanban();
  const { CreateListModalOpen, setCreateListModalOpen } = useProject();
  const { projectId } = useParams<{ projectId: string }>();
  const token = localStorage.getItem("authToken");

  const getProjectData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/projects/project/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProject(response?.data?.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, token, setProject, setError, setLoading]);

  useEffect(() => {
    getProjectData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    let updatedProject;

    if (type === "list") {
      if (source.index !== destination.index) {
        updatedProject = await reorderLists(source.index, destination.index);
      }
    } else {
      if (source.droppableId === destination.droppableId) {
        if (source.index !== destination.index) {
          updatedProject = await reorderTickets(
            source.droppableId,
            source.index,
            destination.index,
          );
        }
      } else {
        updatedProject = await moveTicket(
          source.droppableId,
          destination.droppableId,
          source.index,
          destination.index
        );
      }
    }

    if (updatedProject) {
      await updateProject(updatedProject);
    }
  };

  if (loading) return <div>Loading board...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
    <div className="flex flex-col items-center justify-center w-full gap-4 pb-12">
        <h2 className="text-center text-lg md:text-2xl font-semibold pt-2">
          {project?.title}
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
            className="flex flex-row w-full max-w-screen overflow-x-auto gap-5 pb-12 "
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {project?.list?.map((listItem, listIndex) => (
              <Draggable
                key={listItem._id}
                draggableId={String(listItem._id)}
                index={listIndex}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="list"
                  >
                    <WorkFlowList
                      id={listItem._id}
                      title={listItem.title}
                      tickets={listItem.list}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {/* onCreate={} */}
            {CreateListModalOpen && <CreateList />}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default KanbanBoard;
