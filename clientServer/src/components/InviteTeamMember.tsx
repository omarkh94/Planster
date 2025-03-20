
import ModalWithChildren from "@/common/ModalWithChildren";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";
import { useParams } from "react-router-dom";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const InviteTeamMember = ({
  setTeamModalOpen,
}: {
  setTeamModalOpen: (value: boolean) => void;
}) => {
  const token = localStorage.getItem("authToken");
  const { teamId } = useParams<{ teamId: string }>();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usersToInvite, setUsersToInvite] = useState<User[]>([]);

  console.log("usersToInvite :>> ", usersToInvite);

  const usersNotInMyProject = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/team/member/${teamId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsersToInvite(response?.data?.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (usersToInvite.length == 0) {
        setError("there are no users to add");
      } else {
        setError(error?.message);
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, token]);

  useEffect(() => {
    usersNotInMyProject();
  }, [usersNotInMyProject]);

  const handleInvite = useCallback(async () => {
    if (!selectedUserId || !teamId) {
      setError("Please select a user to invite.");
      return;
    }

    const roleId = "67b09f7b7c145882dba4c3d2"; // Static roleId for now

    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/team/addMember/${teamId}`,
        { userId: selectedUserId, teamId, roleId }, // Send roleId here
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsersToInvite(response?.data?.data);
      setTeamModalOpen(false); // Close modal on success
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(`Failed to send invite: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [selectedUserId, teamId, token]);

  return (
    <ModalWithChildren onClose={() => setTeamModalOpen(false)} size="small">
      <div className="flex flex-col p-4 justify-between items-center font-glory gap-5">
        <h1 className="font-semibold">Invite Team Member</h1>
        <div className="flex flex-col gap-2 items-start justify-start w-full">
          <label htmlFor="user">Select User</label>
          <Select
            id="user"
            className="outline-none border-border border px-2 py-1 w-full placeholder:font-caveat"
            placeholder="Select a user to invite"
            value={selectedUserId} // ✅ Ensure the value updates correctly
            onChange={(value) => setSelectedUserId(value)} // ✅ Ensure this updates state
            options={usersToInvite.map((user) => ({
              label: `${user.firstName} ${user.lastName} (${user.email})`,
              value: user._id,
            }))}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          className="bg-primary border border-border px-6 py-2 text-white font-semibold"
          type="submit"
          onClick={handleInvite} // ✅ Ensure function is called correctly
          disabled={loading}
          autoFocus
        >
          {loading ? "Sending..." : "Add Member"}
        </button>
      </div>
    </ModalWithChildren>
  );
};

export default InviteTeamMember;
