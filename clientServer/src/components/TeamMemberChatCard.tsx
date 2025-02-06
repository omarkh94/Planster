import { TeamMember } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
const TeamMemberChatCard = ({ member }: { member: TeamMember }) => {
  const randomId = Math.floor(Math.random() * 99999)
  return (
    <div className="flex flex-row gap-4 justify-between items-center bg-white w-full  p-4 rounded-md hover:bg-white/60 hover:text-white">
      <div className="flex flex-row items-center gap-2">
        <Avatar>
          <AvatarImage src={`https://avatars.githubusercontent.com/u/${randomId}?v=4`} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <h1 className="text-base sm:text-lg  lg:text-xl xl:text-2xl  font-semibold ">
          {member.user?.name} {member.user?.lastName}
        </h1>
      </div>
      <p className="text-lg capitalize font-semibold italic text-black/70">
        {member.role?.role}
      </p>
    </div>
  );
};

export default TeamMemberChatCard;
