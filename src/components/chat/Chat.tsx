import React, { useEffect, useRef, useState } from "react";
import { IMessage } from "@/types/chat";
import { useSocket } from "../provider/SocketProvider";
import useMounted from "@/hooks/useMounted";
import { useAuthStore } from "@/zustand/useAuth";
import { RiCloseLine } from "react-icons/ri";

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chat: React.FC<ChatProps> = ({ isOpen, onClose }) => {
  const { socket } = useSocket();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const { isMounted } = useMounted();
  const isLogin = !!user;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    const username = user && user.name ? user.name : "Anonymous";
    const userId = user && user.id ? user.id : "unknown";

    if (currentMessage) {
      try {
        console.log("Sending message:", { username, userId, content: currentMessage });

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            userId,
            content: currentMessage
          })
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error sending message:", errorText);
          alert("Failed to send message: " + errorText);
        } else {
          setCurrentMessage("");
        }
      } catch (error) {
        console.error("Error in fetch request:", error);
        alert("An unexpected error occurred while sending the message.");
      }
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("message", (message: IMessage) => {
        setMessages((prev) => [...prev, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off("message");
      }
    };
  }, [socket]);

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") sendMessage();
    };
    window.addEventListener("keyup", handleEnter);
    return () => window.removeEventListener("keyup", handleEnter);
  }, [currentMessage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 flex h-96 w-80 flex-col rounded-lg border border-gray-300 bg-white shadow-lg">
      <button onClick={onClose} className="absolute right-2 top-2 text-gray-600 hover:text-gray-900">
        <RiCloseLine />
      </button>
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.userId === user?.id ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block rounded-lg px-3 py-2 ${message.userId === user?.id ? "bg-green-200 text-black" : "bg-gray-700 text-white"}`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-300 bg-gray-100 p-2">
        <div className="flex">
          <input
            type="text"
            disabled={!isLogin}
            placeholder={isLogin ? "Type message..." : "Login first"}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="mr-2 flex-1 rounded-lg border border-gray-300 px-3 py-1"
          />
          <button
            onClick={sendMessage}
            disabled={!isLogin}
            className={`rounded-lg px-4 py-1 ${isLogin ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
