import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import InviteTeamMember from "@/components/InviteTeamMember";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui";

const TeamTable = () => {
  const { teamId } = useParams();
  const token = localStorage.getItem("authToken");

  type TeamType = {
    members: MemberType[];
    name: string;
    _id: string;
  };
  
  type MemberType = {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      jobTitle: string;
      phoneNumber: string;
    };
    role: {
      _id: string;
      role: string;
      permissions: string[];
    };
    _id: string;
  };
  const [teams, setTeams] = useState<TeamType>({} as TeamType);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/team/${teamId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeams(response.data.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("error :>> ", error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        alert(error.message);
      }
    }
  };
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, token]);
  return (
    <>
      <div className="flex flex-col items-center gap-12  ">
        <h1 className="text-4xl font-bold font-caveat">
          Team
          {teams?.name}
        </h1>

        <div className="max-w-[90vw] w-full  overflow-x-scroll">
          <table className="w-full">
            <thead>
              <tr className="bg-primary py-2 h-12 text-white text-nowrap text-base">
                <th className="w-[25%] text-start px-2">Name</th>
                <th className="w-[25%] text-start px-2">Job Title</th>
                <th className="w-[25%] text-start px-2">Email</th>
                <th className="w-[25%] text-start px-2">Phone Number</th>
              </tr>
            </thead>
            <tbody className="text-base font-light">
              {teams?.members?.map((member) => (
                <tr key={member._id} className="bg-white hover:bg-gray-100">
                  <td className="w-[25%] text-start px-2 py-4">
                    {member.user.firstName} {member.user.lastName}
                  </td>
                  <td className="w-[25%] text-start px-2">
                    {member.user.jobTitle}
                  </td>
                  <td className="w-[25%] text-start px-2">
                    {member.user.email}
                  </td>
                  <td className="w-[25%] text-start px-2">
                    {member.user.phoneNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button
          className="bg-primary text-white p-2 rounded-md"
          onClick={() => {
            setTeamModalOpen(true);
          }}
        >
          Add Team member <PlusIcon />
        </Button>
      </div>
      {teamModalOpen && (
        <InviteTeamMember setTeamModalOpen={setTeamModalOpen} />
      )}
    </>
  );
};

export default TeamTable;


