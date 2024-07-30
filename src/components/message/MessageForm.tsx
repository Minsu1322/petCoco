import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/zustand/useAuth";
import { createClient } from "@/supabase/client";

const supabase = createClient();

interface MessageFormProps {
  receiverId: string;
}

interface MessageData {
  content: string;
}

export const MessageForm: React.FC<MessageFormProps> = ({ receiverId }) => {
  const [content, setContent] = useState("");
  const { user } = useAuthStore();

  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: async (messageData: MessageData) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.from("messages").insert([
        {
          sender_id: user.id,
          receiver_id: receiverId,
          content: messageData.content
        }
      ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setContent("");
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      sendMessage.mutate({ content });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex border-t border-[#1FE476] p-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="메시지를 입력하세요"
        className="flex-grow rounded-l-md border border-[#1FE476] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1FE476]"
      />
      <button
        type="submit"
        disabled={sendMessage.isPending}
        className={`rounded-r-md px-4 py-2 text-white ${
          sendMessage.isPending ? "bg-gray-400" : "bg-[#1FE476] hover:bg-[#1AD065]"
        }`}
      >
        전송
      </button>
    </form>
  );
};
