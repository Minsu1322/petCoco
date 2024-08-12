import React, { useState, KeyboardEvent, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/zustand/useAuth";
import { createClient } from "@/supabase/client";
import Image from "next/image";

const supabase = createClient();

interface MessageFormProps {
  receiverId: string;
  markMessagesAsRead: (userId: string) => Promise<void>;
}

interface MessageData {
  content: string;
}

export const MessageForm: React.FC<MessageFormProps> = ({ receiverId, markMessagesAsRead }) => {
  const [content, setContent] = useState("");
  const { user } = useAuthStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();

  const handleFocus = () => {
    markMessagesAsRead(receiverId);
  };

  const sendMessage = useMutation({
    mutationFn: async (messageData: MessageData) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            sender_id: user.id,
            receiver_id: receiverId,
            content: messageData.content
          }
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      console.log("Message sent successfully:", data);
      setContent("");
      await queryClient.invalidateQueries({ queryKey: ["messages", user?.id] });
      if (textareaRef.current) {
        textareaRef.current.style.height = "36px";
      }
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      alert(error.message);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      sendMessage.mutate({ content });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "36px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 100)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <div className="relative flex items-center">
        <textarea
          ref={textareaRef}
          value={content}
          onFocus={handleFocus}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          className="max-h-[100px] min-h-[36px] w-full resize-none overflow-hidden rounded-full border border-mainColor px-4 py-2 pr-12 text-base leading-6 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mainColor"
        />
        <button
          type="submit"
          disabled={sendMessage.isPending}
          className={`absolute right-2 flex items-center justify-center rounded-full transition-opacity duration-300 ${
            sendMessage.isPending ? "opacity-50" : "opacity-100"
          }`}
        >
          <Image src="/assets/svg/Send.svg" alt="Send" width={20} height={20} />
        </button>
      </div>
    </form>
  );
};
