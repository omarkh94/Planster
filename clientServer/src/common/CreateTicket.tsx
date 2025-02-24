import React, { useState } from "react";
import { TicketType } from "../types";
import ModalWithChildren from "./ModalWithChildren";
import axios from "axios";

const CreateTicket: React.FC<{
  onCreate: (card: TicketType) => void;
  onClose: () => void;
  projectId: string;
  listId: string;
}> = ({ onCreate, onClose, projectId, listId }) => {
  const [values, setValues] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post<TicketType>(
        `${import.meta.env.VITE_APP_API_URL}/projects/workFlowList/ticket/new`,
        {
          projectId,
          listId,
          title: values.title,
          description: values.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onCreate(data);
      onClose();
    } catch (error) {
      setError("Failed to create ticket");
      console.error("Ticket creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWithChildren onClose={onClose} size="medium">
      <div className="flex flex-col gap-5 items-center p-4 lg:p-8 font-glory">
        <h1 className="font-semibold">Create New Ticket</h1>

        {error && (
          <div className="text-red-500 text-sm w-full text-center">{error}</div>
        )}

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

          <div className="flex flex-row gap-2 items-end justify-end w-full">
            <button
              type="button"
              onClick={onClose}
              className="bg-lightError border border-border px-6 py-2 text-white font-semibold "
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="bg-primary border border-border px-6 py-2 text-white font-semibold"
              type="submit"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </ModalWithChildren>
  );
};

export default CreateTicket;




// import { useKanban } from '@/Context/KanbanContext';
// import { useState } from 'react';

// const CreateTicket = ({ listId }: { listId: string }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const { addTicket, loading } = useKanban();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim()) return;
//     await addTicket(listId, { title, description });
//     setTitle('');
//     setDescription('');
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-2 mt-2">
//       <input
//         type="text"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder="Ticket title"
//         className="w-full px-2 py-1 border rounded text-sm"
//         disabled={loading}
//       />
//       <textarea
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         placeholder="Description"
//         className="w-full px-2 py-1 border rounded text-sm"
//         rows={3}
//         disabled={loading}
//       />
//       <button
//         type="submit"
//         className="w-full bg-green-500 text-white py-1 rounded text-sm hover:bg-green-600 disabled:bg-gray-400"
//         disabled={loading || !title.trim()}
//       >
//         {loading ? 'Adding...' : 'Add Ticket'}
//       </button>
//     </form>
//   );
// };

// export default CreateTicket;