import { MessageType } from "@/types";
import { useState } from "react";
import { Socket } from "socket.io-client";

interface SendMessageProps {
  socketRef: React.RefObject<Socket | null>;
  roomId: string | null;
  userId: string | null;
  selectedMessage: MessageType | null;
  onCancelReply: () => void;
}

const SendMessage: React.FC<SendMessageProps> = ({
  socketRef,
  roomId,
  userId,
  selectedMessage,
  onCancelReply,
}) => {
  const [cloud, setCloud] = useState<string>("");

  const extractMentions = (message: string) => {
    const mentions = message.match(/@([a-zA-Z0-9_]+)/g) || [];
    return mentions.map((mention) => mention.slice(1));
  };

  const handleSend = () => {
    if (socketRef.current && roomId && userId && cloud.trim()) {
      const mentions = extractMentions(cloud);
      const replyTo = selectedMessage?.id;
      
      socketRef.current.emit("SEND_MESSAGE", {
        roomId,
        message: cloud,  
        from: localStorage.getItem("name"),
        userId,
        mentions,
        replyTo,
      });

      setCloud("");  
      onCancelReply(); 
    } else {
      console.log("Error: Missing required fields (roomId, userId, or message content).");
    }
  };

  return (
    <div className="drop-shadow-lg bg-secondary  w-full flex flex-col gap-2 items-center p-1 px-4 ">
      {selectedMessage?.id && (
        <div className="w-full flex flex-row justify-between">
          <p className="replying-to">
            Replying to : {selectedMessage?.sender?.firstName}
          </p>
        </div>
      )}
      <div className="w-full flex flex-row gap-2 items-center  justify-center">
        <input
          type="text"
          value={cloud}
          className="w-full bg-transparent outline-none py-2"
          onChange={(e) => setCloud(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <div className="flex flex-row gap-2 items-center justify-center">
          <button className="p-2 border text-primary border-gray-300 rounded-md" onClick={handleSend}>
            Send
          </button>
          {selectedMessage?.id && (
            <button className="p-2 border text-primary border-gray-300 rounded-md" onClick={onCancelReply}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
