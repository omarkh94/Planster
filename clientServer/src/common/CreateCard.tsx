import React, { useState } from "react";
import { CardType, UserType } from "../types";
import ModalWithChildren from "./ModalWithChildren";

const CreateCard: React.FC<{
  onCreate: (card: CardType) => void;
  onClose: () => void;
}> = ({ onCreate, onClose }) => {
  const [values, setValues] = useState<CardType>({
    id: `card-${Math.random()}`,
    title: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    author: { id: "user-1", name: "Author" } as UserType,
    assignee: { id: "user-2", name: "Assignee" } as UserType,
    comments: [],
  });

  const handleClose = () => {
    setValues({
      id: `card-${Math.random()}`,
      title: "",
      description: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      author: { id: "user-1", name: "Author" } as UserType,
      assignee: { id: "user-2", name: "Assignee" } as UserType,
      comments: [],
    });
    onClose();
  };

  const handleCreate = () => {
    const newCard: CardType = {
      id: `card-${Math.random()}`,
      title: values.title,
      description: values.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      author: { id: "user-1", name: "Author" } as UserType,
      assignee: { id: "user-2", name: "Assignee" } as UserType,
      comments: [],
    };
    onCreate(newCard);
    handleClose();
  };

  return (
    <ModalWithChildren onClose={handleClose} size="medium">
      <div className="flex flex-col gap-5 items-center  p-4 lg:p-8 font-glory">
        <h1 className="font-semibold">Create New Card</h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleCreate}>
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              className="outline-none border-border border px-2 py-1 w-full placeholder:font-caveat"
              placeholder="Card Title"
              value={values.title}
              onChange={(e) => setValues({ ...values, title: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              className="outline-none border-border border px-2 py-1 w-full placeholder:font-caveat"
              placeholder="Card Description"
              value={values.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
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

export default CreateCard;
