import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import MessageList from "../components/MessageList";
import SendMessage from "../components/SendMessage";
import { MessageType } from "../types";
import { Button } from "@/components/ui";
import { PlusIcon } from "lucide-react";
import MemberChatCard from "@/components/MemberChatCard";
import { projects } from "@/mock";
import InviteTeamMember from "@/components/InviteTeamMember";


const ChatRoom = () => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(
    null
  );
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  useEffect(() => {
    
    const roomId = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
  
    if (roomId && userId) {
      socketRef.current = io(import.meta.env.VITE_APP_API_URL);
      socketRef.current.connect();
  
      socketRef.current.emit("JOIN_ROOM", { roomId, userId });
  
      socketRef.current.on("INITIAL_MESSAGES", (initialMessages: MessageType[]) => {
        setMessages(initialMessages);
      });
  
      socketRef.current.on("RECEIVE_MESSAGE", (newMessage: MessageType) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
  
      return () => {
        socketRef.current?.disconnect();
      };
    } else {
      console.error("Missing roomId or userId in localStorage");
    }
  }, []);
  

  const handleReply = (message: MessageType) => {
    console.log("Replying to:", message);
    setSelectedMessage(message);
  };

  const handleCancelReply = () => {
    setSelectedMessage(null);
  };

  const handleDelete = (messageId: string) => {
    socketRef.current?.emit("DELETE_MESSAGE", {
      roomId: localStorage.getItem("projectId"),
      messageId,
    });

    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message, isDeleted: true } : message
      )
    );
  };
  const handleInvite = () => {
    setTeamModalOpen(true);
  };
  return (
    <div className="flex flex-row w-full  max-h-[calc(100vh)] h-[calc(100vh-65px)]">
      <div className="min-h-full  flex-col gap-2 p-4 border-e border-e-gray-300 w-1/3 bg-[#89a6ac] hidden lg:flex">
        {/* Header */}
        <div className="w-full flex flex-row gap-4 justify-between items-center">
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-caveat font-semibold">
            Team Members
          </h2>{" "}
          <Button onClick={handleInvite}>
            Add Team member <PlusIcon />
          </Button>
        </div>
        {/* Team Members */}
        {projects[0].members.map((elem) => {
          return <MemberChatCard key={elem.user.id} member={elem} />;
        })}
      </div>

      <div className="flex flex-col justify-between bg-primary/50 min-h-full w-full lg:w-2/3">
        <div className="drop-shadow-lg bg-secondary h-16 w-full flex items-center justify-center border-b ">
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-caveat font-semibold text-primary">
            Team:name
          </h1>
        </div>
        {localStorage.getItem("userId") ? (
          <>
            <MessageList
              messages={messages}
              onReply={handleReply}
              selectedMessageId={selectedMessage?.id ?? ""}
              userId={localStorage.getItem("userId")!} 
              onDelete={handleDelete}
            />
            <SendMessage
              socketRef={socketRef}
              roomId={localStorage.getItem("projectId")}
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
