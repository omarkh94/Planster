import { useState } from "react";
import { Socket } from "socket.io-client";
import "../style/message.css";

interface SendMessageProps {
  socketRef: React.RefObject<Socket | null>;
  roomId: string | null;
  userId: string | null;
  selectedMessageId: string | null;
  onCancelReply: () => void; 
}

const SendMessage: React.FC<SendMessageProps> = ({
  socketRef,
  roomId,
  userId,
  selectedMessageId,
  onCancelReply,
}) => {
  const [cloud, setCloud] = useState<string>("");

  const extractMentions = (message: string) => {
    const mentions = message.match(/@([a-zA-Z0-9_]+)/g) || [];
    return mentions.map((mention) => mention.slice(1)); 
  };

  const handleSend = () => {
    if (socketRef.current && roomId && userId) {
      const mentions = extractMentions(cloud); 
      const replyTo = selectedMessageId;
      socketRef.current.emit("SEND_MESSAGE", {
        roomId,
        message: cloud,
        userId,
        mentions,
        replyTo,
      });

      setCloud(""); 
      onCancelReply(); 
    }
  };

  return (
    <div className="message-input">
      {selectedMessageId && (
        <div className="reply-message-box">
          <p className="replying-to">Replying to message ID: {selectedMessageId}</p>
          <button className="cancel-reply" onClick={onCancelReply}>Cancel Reply</button>
        </div>
      )}
      <input
        type="text"
        value={cloud}
        onChange={(e) => setCloud(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default SendMessage;
