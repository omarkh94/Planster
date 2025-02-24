import React, { useState } from "react";
import ModalWithChildren from "./ModalWithChildren";
import axios from "axios";
import { useKanban } from "@/Context/KanbanContext";
import { toast } from "sonner";

const CreateTicket: React.FC<{
  onClose: () => void;
  projectId: string;
  listId: string;
}> = ({ onClose, projectId, listId }) => {
  const [values, setValues] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const { setProject } = useKanban();
  const token = localStorage.getItem("authToken");

  const handleCreateNewCard = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/projects/card/new/${projectId}`,
        {
          title: values.title,
          description: values.description,
          listId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response.data?.data :>> ", response.data?.data);
      setProject(response.data?.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = async () => {
    await handleCreateNewCard();
    onClose();
  };
  return (
    <ModalWithChildren onClose={onClose} size="medium">
      <div className="flex flex-col gap-5 items-center  p-4 lg:p-8 font-glory">
        <h1 className="font-semibold">Create New Ticket</h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleCreate}>
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              className="outline-none border-border border px-2 py-1 w-full placeholder:font-caveat"
              placeholder="Ticket title"
              value={values.title}
              onChange={(e) => setValues({ ...values, title: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="outline-none border-border border px-2 py-1 w-full placeholder:font-caveat"
              placeholder="Ticket description"
              value={values.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              disabled={loading}
            />
          </div>
        </form>
        <div className="flex flex-row gap-2 items-end justify-end w-full">
          <button
            autoFocus
            onClick={onClose}
            className="bg-lightError border border-border px-6 py-2 text-white font-semibold "
          >
            Cancel
          </button>
          <button
            className="bg-primary border border-border px-6 py-2 text-white font-semibold"
            type="submit"
            onClick={handleCreate}
            autoFocus
          >
            Create
          </button>
        </div>
      </div>
    </ModalWithChildren>
  );
};

export default CreateTicket;
