import React, { useEffect, useRef } from "react";
import { MessageType, UserType, ReplyType } from "../types";
import { timeAgo } from "@/helpers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDelete = (message: MessageType) => {
    const messageId = message.id || message._id;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    messageId ? onDelete(messageId) : console.error("Message ID missing");
  };

  const isCurrentUser = (user?: UserType) => user?.id === userId || user?._id === userId;

  const renderUserAvatar = (user?: UserType) => (
    <Avatar className="w-8 h-8">
      <AvatarImage src={`https://avatars.githubusercontent.com/u/${user?.id || user?._id || '0'}?v=4`} />
      <AvatarFallback>
        {(user?.firstName?.[0] || '') + (user?.lastName?.[0] || '') || 'U'}
      </AvatarFallback>
    </Avatar>
  );

  const renderReply = (reply: ReplyType) => (
    <div className="ml-4 mt-2 p-2 bg-gray-100 rounded-md">
      <div className="flex items-center gap-2">
        {renderUserAvatar(reply.sender)}
        <span className="font-semibold">
          {reply.sender?.firstName || 'Unknown'} {reply.sender?.lastName || ''}
        </span>
      </div>
      <p className="mt-1 text-sm">{reply.content}</p>
    </div>
  );

  return (
    <div className="p-4 flex flex-col gap-4 overflow-y-auto scrollStyle">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages
          .filter(message => !message.isDeleted)
          .map(message => {
            const timestamp = message.timestamp instanceof Date 
              ? message.timestamp 
              : new Date(message.timestamp);

            return (
              <div
                key={message.id || message._id || `temp-${timestamp.getTime()}`}
                className={`bg-gray-100 p-4 rounded-lg shadow w-96${
                  (message.id || message._id) === selectedMessageId 
                    ? "border-2 border-blue-500" 
                    : ""
                } ${
                  isCurrentUser(message.sender)
                    ? "ml-auto bg-green-200"
                    : "mr-auto bg-blue-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {renderUserAvatar(message.sender)}
                  <div>
                    <h2 className="font-semibold">
                      {message.sender?.firstName || 'Unknown'}{' '}
                      {message.sender?.lastName || ''}
                    </h2>
                    <span className="text-xs text-gray-500">
                      {timeAgo(timestamp)}
                    </span>
                  </div>
                </div>
                <p className="text-base mb-2">{message.content}</p>
                
                {message.mentions?.length > 0 && (
                  <div className="mb-2 text-sm text-blue-600">
                    Mentions: {message.mentions
                      .map(user => `@${user?.firstName || 'unknown'}`)
                      .join(', ')}
                  </div>
                )}
                
                {message.replies?.length > 0 && (
                  <div className="mt-2 border-t border-gray-200 pt-2">
                    <h3 className="text-sm font-semibold mb-1">Replies:</h3>
                    {message.replies.map((reply, index) => (
                      <div key={index}>{renderReply(reply)}</div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>
                    Seen by: {(message.seenBy || [])
                      .map(user => user?.firstName || 'unknown')
                      .join(', ')}
                  </span>
                  <span>
                    Delivered to: {(message.deliveredTo || []).length} users
                  </span>
                </div>
                
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => onReply(message)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Reply
                  </button>
                  {isCurrentUser(message.sender) && (
                    <button
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => handleDelete(message)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
      )}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;