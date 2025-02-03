import ModalWithChildren from "@/common/ModalWithChildren";
import { useState } from "react";
const InviteTeamMember = ({
  setTeamModalOpen,
}: {
  setTeamModalOpen: (value: boolean) => void;
}) => {
  const [email, setEmail] = useState("");
  const handleInvite = () => {
    // TODO: Implement invite team member
  };
  return (
    <ModalWithChildren onClose={() => setTeamModalOpen(false)} size="small">
      <div className="flex flex-col p-4 justify-between items-center font-glory gap-5">
        <h1 className="font-semibold">Invite Team Member</h1>
        <div className="flex flex-col gap-2 items-start justify-start w-full">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="outline-none border-border border px-2 py-1 w-full placeholder:font-caveat"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className="bg-primary border border-border px-6 py-2 text-white font-semibold"
          type="submit"
          onClick={handleInvite}
          autoFocus
        >
          Invite
        </button>{" "}
      </div>
    </ModalWithChildren>
  );
};

export default InviteTeamMember;
