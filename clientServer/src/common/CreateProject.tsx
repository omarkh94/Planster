import { useState } from "react";
import { useUser } from "../store/UserStore";
import { ProjectType } from "../types";
import DatePicker from "./DatePicker";
import ModalWithChildren from "./ModalWithChildren";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateProject = () => {
  const navigate = useNavigate();
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

  // Close modal
  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    try {
      const newProject = {
        title: values.title,
        description: values.description,
        expectedDeadLine: values.expectedDeadLine ?? new Date(),
      };

      const response = await axios.post<ProjectType>(
        `${import.meta.env.VITE_APP_API_URL}/projects/new`,
        newProject,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Ignore the TypeScript error for the line where the response is accessed
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      navigate(`/project/${response.data.data._id}`);

      setProjects([...projects, response.data]);

      setTimeout(() => {
        setDialogOpen(false);
      }, 300);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("An error occurred while creating the project. Please try again.");
    }
  };

  return (
    <ModalWithChildren onClose={handleClose} size="medium">
      <div className="flex flex-col gap-5 items-center p-4 lg:p-8 font-glory">
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
              required
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
              required
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
          <div className="flex flex-row gap-2 items-end justify-end w-full">
            <button
              className="bg-primary border border-border px-6 py-2 text-white font-semibold"
              type="submit"
              autoFocus
            >
              Create
            </button>
            <button
              autoFocus
              onClick={handleClose}
              className="bg-lightError border border-border px-6 py-2 text-white font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ModalWithChildren>
  );
};

export default CreateProject;
