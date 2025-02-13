import ModalWithChildren from "@/common/ModalWithChildren";
import { useState } from "react";
import axios from "axios";
const InviteTeamMember = ({
  setTeamModalOpen,
}: {
  setTeamModalOpen: (value: boolean) => void;
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };
  const handleInvite = async () => {
    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null); 

    try {
      await axios.post("/api/invite", { email });
      setTeamModalOpen(false); 
    } catch (err) {
      console.log('err :>> ', err);
      setError("Failed to send invite. Please try again.");
    } finally {
      setLoading(false);
    }
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          className="bg-primary border border-border px-6 py-2 text-white font-semibold"
          type="submit"
          onClick={handleInvite}
          disabled={loading}
          autoFocus
        >
         {loading ? "Sending..." : "Invite"}
        </button>{" "}
      </div>
    </ModalWithChildren>
  );
};

export default InviteTeamMember;
