import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import MessageList from "../components/MessageList";
import SendMessage from "../components/SendMessage";
import "../style/message.css";
import { MessageType } from "../types";

const ChatRoom = () => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_APP_SOCKET_SERVER);
    socketRef.current.connect();

    socketRef.current.emit("JOIN_ROOM", {
      roomId: localStorage.getItem("teamId"),
      userId: localStorage.getItem("userId"),
    });

    socketRef.current.on(
      "INITIAL_MESSAGES",
      (initialMessages: MessageType[]) => {
        setMessages(initialMessages);
      }
    );

    socketRef.current.on("RECEIVE_MESSAGE", (newMessages: MessageType[]) => {
      setMessages(newMessages);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleReply = (messageId: string) => {
    setSelectedMessageId(messageId);
  };

  const handleCancelReply = () => {
    setSelectedMessageId(null);
  };

  const handleDelete = (messageId: string) => {
    socketRef.current?.emit("DELETE_MESSAGE", {
      roomId: localStorage.getItem("teamId"),
      messageId,
    });

    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message, isDeleted: true } : message
      )
    );
  };

  return (
    <div className="chatRoomWrapper">
      <div className="loginForm">
        <MessageList
          messages={messages}
          onReply={handleReply}
          selectedMessageId={selectedMessageId}
          userId={localStorage.getItem("userId")}
          onDelete={handleDelete}
        />
        <SendMessage
          socketRef={socketRef}
          roomId={localStorage.getItem("teamId")}
          userId={localStorage.getItem("userId")}
          selectedMessageId={selectedMessageId}
          onCancelReply={handleCancelReply}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
