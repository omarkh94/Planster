import { useState } from "react";
import { mockData } from "../mock";
import { useUser } from "../store/UserStore";
import { CardListType, TeamType, UserType } from "../types";
import DatePicker from "./DatePicker";
import ModalWithChildren from "./ModalWithChildren";

type ProjectType = {
  id: string;
  title: string;
  description: string;
  expectedDeadLine: Date;
  team: TeamType;
  projectOwner: UserType;
  list: Array<CardListType>;
  updatedBy?: UserType;
};

const CreateProject = () => {
  const { setDialogOpen, setProjects, projects } = useUser();
  const [values, setValues] = useState<{
    title: string;
    description: string;
    expectedDeadLine: Date | undefined;
  }>({
    title: "",
    description: "",
    expectedDeadLine: undefined,
  });
  const team: TeamType = mockData.teams[0];

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleCreate = () => {
    const newProject: ProjectType = {
      id: Math.random().toString(),
      title: values.title,
      description: values.description,
      expectedDeadLine: values.expectedDeadLine ?? new Date(),
      team: team,
      projectOwner: {
        id: "owner-id",
        name: "Project Owner",
        lastName: "",
        email: "",
        password: "",
        jobTitle: "",
        gender: "male",
        phoneNumber: 0,
      },
      list: [],
    };

    setProjects([...projects, newProject]);

    setTimeout(() => {
      setDialogOpen(false);
    }, 750);
  };

  return (
    <ModalWithChildren onClose={handleClose} size="medium">
      <div className="flex flex-col gap-5 items-center  p-4 lg:p-8 font-glory">
        <h1 className="font-semibold">Create New Project</h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleCreate}>
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <label htmlFor="project-title">Project Title</label>
            <input
              id="project-title"
              type="text"
              className="outline-none border-border border px-2 py-1 w-full placeholder:font-caveat"
              placeholder="Project Title"
              value={values.title}
              onChange={(e) => setValues({ ...values, title: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <label htmlFor="project-description">Project Description</label>
            <input
              id="project-description"
              type="text"
              className="outline-none border-border border px-2 py-1 w-full placeholder:font-caveat"
              placeholder="Project Description"
              value={values.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <label htmlFor="project-Deadline">Deadline</label>
            <DatePicker
              date={values.expectedDeadLine}
              setDate={(date) =>
                setValues({ ...values, expectedDeadLine: date })
              }
            />
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
export default CreateProject;
