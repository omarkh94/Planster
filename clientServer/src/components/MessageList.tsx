
            import { useEffect, useRef } from "react";
            import { MessageType } from "../types";
            
            interface MessageListProps {
              messages: MessageType[];
              onReply: (messageId: string) => void;
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
                <div className="message-list">
                  {messages
                    .filter((message) => !message.isDeleted) 
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`message-item ${
                          message.id === selectedMessageId ? "selected" : ""
                        } ${message.sender.id === userId ? "owner" : ""}`} 
                      >
                        <div className="message-header">
                          <strong>{message.sender.name}</strong> -{" "}
                          {new Date(message.timestamp).toLocaleString()}
                        </div>
                        <div className="message-content">{message.content}</div>
                        {message.replies.length > 0 && (
                          <div className="replies">
                            {message.replies.map((reply, index) => (
                              <div key={index} className="reply-item">
                                {reply.reply}
                              </div>
                            ))}
                          </div>
                        )}
                        <button onClick={() => onReply(message.id)} className="reply-button">
                          Reply
                        </button>
            
                        {message.sender.id === userId && (
                          <button
                            className="delete-button"
                            onClick={() => onDelete(message.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
            
                  <div ref={messageEndRef} />
                </div>
              );
            };
            
            export default MessageList;
            