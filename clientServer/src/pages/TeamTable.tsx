import InviteTeamMember from "@/components/InviteTeamMember";
import { useState } from "react";
import { mockData } from "../mock";
import { TeamType } from "../types";

const TeamTable = () => {
  const id: string = "t1";

  const [teams] = useState<TeamType[]>(mockData.teams);
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  const team = teams.find((team: TeamType) => team.id === id);

  if (!team || team.isDeleted) {
    return (
      <div className="wraper">
        <div className="TeamModal">
          <h2 className="teamModalError">No team available</h2>
        </div>
      </div>
    );
  }

  const sortedMembers = [...team.members].sort((a, b) => {
    if (a.role.role === "admin") return -1;
    if (b.role.role === "admin") return 1;
    if (a.role.role === "supervisor") return -1;
    if (b.role.role === "supervisor") return 1;
    return 0;
  });

  return (
    <>
      <div className="flex flex-col items-center gap-12  ">
        <h1 className="text-4xl font-bold font-caveat">Team {team.name}</h1>

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
              {sortedMembers.map(
                (member, index) =>
                  !member.user.isDeleted && (
                    <>
                      <tr key={index} className="bg-white hover:bg-gray-100">
                        <td className="w-[25%] text-start px-2 py-4">
                          {member.user.name} {member.user.lastName}
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
                      <tr>
                        <td>
                          <div className="w-full h-[1px] bg-gray-300"></div>
                        </td>
                      </tr>
                    </>
                  )
              )}
            </tbody>
          </table>
        </div>

        <button
          className="bg-primary text-white p-2 rounded-md"
          onClick={() => {
            setTeamModalOpen(true);
          }}
        >
          Invite Member
        </button>
      </div>
      {teamModalOpen && (
        <InviteTeamMember setTeamModalOpen={setTeamModalOpen} />
      )}
    </>
  );
};

export default TeamTable;
