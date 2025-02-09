import * as React from "react";

import { useProject } from "@/store/useProject";
import { WorkFlowListType, UserType } from "../types";
import ModalWithChildren from "./ModalWithChildren";
import { useParams } from "react-router-dom";
import { projects } from "@/mock";

const CreateList: React.FC<{
  onCreate: (list: WorkFlowListType) => void;
}> = ({ onCreate }) => {
  const { setCreateListModalOpen } = useProject();

  const { id } = useParams<{ id: string }>();
  const selectedProject = projects.find((project) => project.id === id);
  const [values, setValues] = React.useState<WorkFlowListType>({
    id: `list-${Math.random()}`,
    title: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    author: { id: "user-1", name: "Author" } as unknown as UserType,
    updatedBy: { id: "user-1", name: "Author" } as unknown as UserType,
    list: [],
    project: selectedProject ?? {
      id: "",
      title: "",
      description: "",
      teams: [],
      projectOwner: { id: "", name: "" } as unknown as UserType,
      expectedDeadLine: new Date(),
      members: [],
      list: [],
    },
  });
  const handleClose = () => {
    setCreateListModalOpen(false);
    setValues({
      id: `list-${Math.random()}`,
      title: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      author: { id: "user-1", name: "Author" } as unknown as UserType,
      updatedBy: { id: "user-1", name: "Author" } as unknown as UserType,
      list: [],
      project: selectedProject ?? {
        id: "",
        title: "",
        description: "",
        teams: [],
        projectOwner: { id: "", name: "" } as unknown as UserType,
        expectedDeadLine: new Date(),
        members: [],
        list: [],
      },
    });
  };

  const handleCreate = () => {
    if (!selectedProject) {
      return;
    }
    const newList: WorkFlowListType = {
      id: `list-${Math.random()}`,
      title: values.title,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      author: { id: "user-1", name: "Author" } as unknown as UserType,
      updatedBy: { id: "user-1", name: "Author" } as unknown as UserType,
      list: [],
      project: selectedProject, 
    };

    onCreate(newList);
    handleClose();
  };

  return (
    <ModalWithChildren onClose={handleClose} size="medium">
      <div className="flex flex-col gap-5 items-center  p-4 lg:p-8 font-glory">
        <h1 className="font-semibold">Create New List</h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleCreate}>
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <label htmlFor="list-title">Title</label>
            <select
              id="list-title"
              className="outline-none border-border border px-2 py-1 w-full placeholder:font-caveat"
              value={values.title}
              onChange={(e) =>
                setValues({
                  ...values,
                  title: e.target.value as WorkFlowListType["title"],
                })
              }
            >
              <option value="Backlog">Backlog</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Blocked">Blocked</option>
              <option value="Code Review">Code Review</option>
              <option value="Ready for QA">Ready for QA</option>
              <option value="QA In Progress">QA In Progress</option>
              <option value="Approved">Approved</option>
              <option value="Done">Done</option>
              <option value="Deployed">Deployed</option>
            </select>
          </div>
        </form>
        <div className="flex flex-row gap-2 items-end justify-end w-full">
          <button
            autoFocus
            onClick={handleClose}
            className="bg-lightError border border-border px-6 py-2 text-white font-semibold "
          >
            Cancel
          </button>
          <button
            className="bg-primary border border-border px-6 py-2 text-white font-semibold"
            type="submit"
            onClick={() => {
              handleCreate();
            }}
            autoFocus
          >
            Create
          </button>
        </div>
      </div>
    </ModalWithChildren>
  );
};

export default CreateList;
