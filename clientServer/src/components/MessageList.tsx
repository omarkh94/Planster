import { useEffect, useRef } from "react";
import { MessageType } from "../types";
import { timeAgo } from "@/helpers";

interface MessageListProps {
  messages: MessageType[];
  onReply: (message: MessageType) => void;
  selectedMessageId: string | null;
  userId: string | null;
  onDelete: (messageId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  onReply,
  selectedMessageId,
  userId,
  onDelete,
}) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="p-4 flex flex-col gap-2 overflow-y-auto scrollStyle">
      {messages
        .filter((message) => !message.isDeleted)
        .map((message) => (
          <div
            key={message.id}
            className={`bg-gray-300 p-2 rounded-md w-[45%] ${
              message.id === selectedMessageId ? "" : ""
            } ${
              message.sender.id === userId
                ? "self-end bg-secondary"
                : "self-start bg-primary/30"
            }`}
          >
            <div className="flex flex-row justify-between items-center gap-2">
              <h2 className="text-lg font-semibold">{message.sender.firstName}</h2>
              {timeAgo(message.timestamp)}
            </div>
            <div className="text-base opacity-80">{message.content}</div>
            {message.replies.length > 0 && (
              <div className="">
                {message.replies.map((reply, index) => (
                  <div key={index} className="reply-item">
                    {reply.reply}
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-row-reverse gap-2 items-center justify-start">
              <button
                onClick={() => onReply(message)}
                className="hover:opacity-80"
              >
                Reply
              </button>

              {message.sender.id === userId && (
                <button
                  className="hover:opacity-80"
                  onClick={() => onDelete(message.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}

      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;
