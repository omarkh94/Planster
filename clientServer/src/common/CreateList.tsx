import { useState } from "react";

import { useProject } from "@/store/useProject";
import ModalWithChildren from "./ModalWithChildren";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useKanban } from "@/Context/KanbanContext";

const CreateList = () => {
  const { setCreateListModalOpen } = useProject();
  const { setProject } = useKanban();
  const token = localStorage.getItem("authToken");
  const { projectId } = useParams<{ projectId: string }>();
  const [listTitle, setListTitle] = useState<string>();
  const handleCreateNewList = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/projects/list/new/${projectId}`,
        {
          title: listTitle,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProject(response.data?.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleClose = () => {
    setCreateListModalOpen(false);
  };

  const handleCreate = async () => {
    await handleCreateNewList();
    handleClose();
  };

  return (
    <ModalWithChildren onClose={handleClose} size="small">
      <div className="flex flex-col gap-5 items-center  p-4 lg:p-8 font-glory">
        <h1 className="font-semibold">Create New List</h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleCreate}>
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <label htmlFor="list-title">List Title</label>
            <input
              id="list-title"
              type="text"
              className="outline-none border-border border px-2 py-1 w-full placeholder:font-caveat"
              placeholder="List Title"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              required
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

export default CreateList;
