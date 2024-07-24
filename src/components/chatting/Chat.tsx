import React, { useEffect, useState, useCallback, useRef } from "react";

import { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Message } from "@/types/chatTypes/ChatTypes";
import { supabase } from "@/supabase/userClient";

interface ChatProps {
  currentUserId: string;
  otherUserId: string;
}

const Chat: React.FC<ChatProps> = ({ currentUserId, otherUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
    } else {
      setMessages(data as Message[]);
    }
    setIsLoading(false);
  }, [currentUserId, otherUserId]);

  useEffect(() => {
    loadMessages();

    const channelName = `chat-${[currentUserId, otherUserId].sort().join("-")}`;

    channelRef.current = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload: RealtimePostgresChangesPayload<Message>) => {
          console.log("Received new message:", payload.new);
          const newMessage = payload.new as Message;
          if (
            (newMessage.sender_id === currentUserId && newMessage.receiver_id === otherUserId) ||
            (newMessage.sender_id === otherUserId && newMessage.receiver_id === currentUserId)
          ) {
            setMessages((current) => [...current, newMessage]);
          }
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for channel ${channelName}:`, status);
        if (status === "SUBSCRIBED") {
          console.log(`Successfully subscribed to channel ${channelName}`);
        }
      });

    return () => {
      if (channelRef.current) {
        console.log(`Removing channel ${channelName}`);
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [currentUserId, otherUserId, loadMessages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend = {
      sender_id: currentUserId,
      receiver_id: otherUserId,
      content: newMessage.trim()
    };

    const { data, error } = await supabase.from("messages").insert(messageToSend).select();

    if (error) {
      console.error("Error sending message:", error);
    } else {
      console.log("Message sent successfully:", data);
      setNewMessage("");
      // 옵션: 메시지를 즉시 표시하기 위해 로컬 상태 업데이트
      setMessages((current) => [...current, data[0] as Message]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) return <div>Loading messages...</div>;

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender_id === currentUserId ? "sent" : "received"}`}>
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">{formatDate(message.created_at)}</div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
