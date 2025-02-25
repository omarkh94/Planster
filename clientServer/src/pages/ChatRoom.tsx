import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import MessageList from "../components/MessageList";
import SendMessage from "../components/SendMessage";
import { Member, MessageType } from "../types";
import { Button } from "@/components/ui";
import { PlusIcon } from "lucide-react";
import MemberChatCard from "@/components/MemberChatCard";
import InviteTeamMember from "@/components/InviteTeamMember";
import { useParams } from "react-router-dom";
import axios from "axios";

type TeamType = {
  members: Member[];
  name: string;
  _id: string;
};

const ChatRoom = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const token = localStorage.getItem("authToken");
  const [team, setTeam] = useState<TeamType | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(
    null
  );
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  const fetchTeam = async () => {
    if (!teamId) return;

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
      setTeam(response.data.data);
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
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, token]);

  useEffect(() => {
    if (!teamId) return;

    const socket = io(import.meta.env.VITE_APP_API_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: localStorage.getItem("authToken"),
        userId: localStorage.getItem("userId"),
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected, joining room:", teamId);
      socket.emit("JOIN_ROOM", {
        teamId: teamId, 
        userId: localStorage.getItem("userId"),
      });
    });

    socket.on("INITIAL_MESSAGES", (initialMessages: MessageType[]) => {
      setMessages(initialMessages);
    });

    socket.on("RECEIVE_MESSAGE", (newMessage: MessageType) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    socketRef.current = socket;

    return () => {
      console.log("Cleaning up socket connection");
      socket.disconnect();
    };
  }, [teamId]); 
  const handleReply = (message: MessageType) => {
    setSelectedMessage(message);
  };

  const handleCancelReply = () => {
    setSelectedMessage(null);
  };

  const handleDelete = (messageId: string) => {
    if (socketRef.current && teamId) {
      socketRef.current.emit("DELETE_MESSAGE", {
        teamId: teamId,
        messageId,
      });

      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === messageId ? { ...message, isDeleted: true } : message
        )
      );
    }
  };

  const handleInvite = () => {
    setTeamModalOpen(true);
  };












  return (
    <div className="flex flex-row w-full  max-h-[calc(88vh)] h-[calc(100vh-65px)] ">
      <div className="min-h-full  flex-col gap-2 p-4 border-e border-e-gray-300 w-1/3 bg-[#89a6ac] hidden lg:flex">
        <div className="w-full flex flex-row gap-4 justify-between items-center">
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-caveat font-semibold">
            Team Members
            
          </h2>
          <Button onClick={handleInvite}>
            Add Team member <PlusIcon />
          </Button>
        </div>
        {team?.members?.map((elem) => (
          <MemberChatCard key={elem.user._id} member={elem} />
        ))}
      </div>

      <div className="flex flex-col justify-between bg-primary/50 min-h-full w-full lg:w-2/3">
        <div className="drop-shadow-lg bg-secondary h-16 w-full flex items-center justify-center border-b ">
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-caveat font-semibold text-primary">
            {team?.name || "Team Chat"}
          </h1>
        </div>
        {localStorage.getItem("userId") ? (
          <>
            <MessageList
              messages={messages}
              onReply={handleReply}
              selectedMessageId={selectedMessage?.id ?? null}
              userId={localStorage.getItem("userId")}
              onDelete={handleDelete}
            />
            <SendMessage
              socketRef={socketRef}
              teamId={teamId ?? null} 
              userId={localStorage.getItem("userId")}
              selectedMessage={selectedMessage}
              onCancelReply={handleCancelReply}
            />
          </>
        ) : (
          <div>User ID not found</div>
        )}
      </div>

      {teamModalOpen && (
        <InviteTeamMember setTeamModalOpen={setTeamModalOpen} />
      )}
    </div>
  );
};

export default ChatRoom;
