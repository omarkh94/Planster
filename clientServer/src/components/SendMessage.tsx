import { MessageType } from "@/types";
import { useState } from "react";
import { Socket } from "socket.io-client";

interface SendMessageProps {
  socketRef: React.RefObject<Socket | null>;
  teamId: string | null;
  userId: string | null;
  selectedMessage: MessageType | null;
  onCancelReply: () => void;
}

const SendMessage: React.FC<SendMessageProps> = ({
  socketRef,
  teamId,
  userId,
  selectedMessage,
  onCancelReply,
}) => {
  const [content, setContent] = useState<string>("");

  const extractMentions = (message: string) => {
    const mentions = message.match(/@([a-zA-Z0-9_]+)/g) || [];
    return mentions.map(mention => mention.slice(1));
  };

  const handleSend = () => {
    if (!socketRef.current || !content.trim() || !teamId || !userId) return;

    try {
      socketRef.current.emit("SEND_MESSAGE", {
        teamId: teamId,
        message: content,
        userId: userId,
        mentions: extractMentions(content),
        replyTo: selectedMessage?.id || null
      });

      setContent("");
      onCancelReply();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="drop-shadow-lg bg-secondary w-full flex flex-col gap-2 items-center p-1 px-4">
      {selectedMessage && (
        <div className="w-full flex flex-row justify-between">
          <p className="text-sm text-gray-600">
            Replying to: {selectedMessage.sender?.firstName || 'Unknown'}
          </p>
          <button
            onClick={onCancelReply}
            className="text-sm text-red-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}
      
      <div className="w-full flex flex-row gap-2 items-center justify-center">
        <input
          type="text"
          value={content}
          className="w-full bg-transparent outline-none py-2 border-b border-gray-300 focus:border-primary"
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button
          className="p-2 bg-primary text-white rounded-md hover:bg-primary/80 disabled:opacity-50"
          onClick={handleSend}
          disabled={!content.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SendMessage;