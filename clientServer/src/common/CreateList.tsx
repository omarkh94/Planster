import * as React from "react";

import { useProject } from "@/store/useProject";
import { CardListType, UserType } from "../types";
import ModalWithChildren from "./ModalWithChildren";

const CreateList: React.FC<{
  onCreate: (list: CardListType) => void;
}> = ({ onCreate }) => {
  const { setCreateListModalOpen } = useProject();
  const [values, setValues] = React.useState<CardListType>({
    id: `list-${Math.random()}`,
    title: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    author: { id: "user-1", name: "Author" } as UserType,
    updatedBy: { id: "user-1", name: "Author" } as UserType,
    list: [],
  });
  const handleClose = () => {
    setCreateListModalOpen(false);
    setValues({
      id: `list-${Math.random()}`,
      title: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      author: { id: "user-1", name: "Author" } as UserType,
      updatedBy: { id: "user-1", name: "Author" } as UserType,
      list: [],
    });
  };

  const handleCreate = () => {
    const newList: CardListType = {
      id: `list-${Math.random()}`,
      title: values.title,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      author: { id: "user-1", name: "Author" } as UserType,
      updatedBy: { id: "user-1", name: "Author" } as UserType,
      list: [],
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
            <input
              id="list-title"
              type="text"
              className="outline-none border-border border px-2 py-1 w-full placeholder:font-caveat"
              placeholder="List Title"
              value={values.title}
              onChange={(e) => setValues({ ...values, title: e.target.value })}
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
