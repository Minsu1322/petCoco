import React, { useState, KeyboardEvent, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/zustand/useAuth";
import { createClient } from "@/supabase/client";
import Image from "next/image";
import Swal from "sweetalert2";

const supabase = createClient();

interface MessageFormProps {
  receiverId: string;
  markMessagesAsRead: (userId: string) => Promise<void>;
}

interface MessageData {
  content: string;
  imageUrl?: string;
}

export const MessageForm: React.FC<MessageFormProps> = ({ receiverId, markMessagesAsRead }) => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const { user } = useAuthStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const handleFocus = () => {
    markMessagesAsRead(receiverId);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from("chat-images").upload(fileName, file);

    if (error) {
      Swal.fire("Error", "Failed to upload image", "error");
      throw error;
    }

    const { data: imagedata } = supabase.storage.from("chat-images").getPublicUrl(fileName);
    return imagedata.publicUrl;
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
            content: messageData.content,
            image_url: messageData.imageUrl
          }
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      console.log("Message sent successfully:", data);
      setContent("");
      setSelectedImage(null);
      setImagePreviewUrl(null);
      queryClient.setQueryData(["messages", user?.id], (oldData: any) => {
        return [...oldData, data[0]];
      });
      if (textareaRef.current) {
        textareaRef.current.style.height = "36px";
      }
      setIsSubmitting(false);
    },
    onError: (error) => {
      Swal.fire("Error", error.message, "error");
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || (!content.trim() && !selectedImage)) return;

    setIsSubmitting(true);
    let imageUrl;
    if (selectedImage) {
      imageUrl = await handleImageUpload(selectedImage);
    }

    sendMessage.mutate({ content, imageUrl });
    setSelectedImage(null);
    setImagePreviewUrl(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  return (
    <form onSubmit={handleSubmit} className="p-2">
      {/* 이미지 미리보기 섹션 */}
      {imagePreviewUrl && (
        <div className="relative mb-3 flex justify-center">
          <div className="relative max-w-sm">
            <Image src={imagePreviewUrl} alt="Preview" width={160} height={160} className="rounded-lg" />{" "}
            <button
              type="button"
              className="absolute right-0 top-0 m-2 rounded-full bg-red-500 p-1 text-white"
              onClick={handleRemoveImage}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* 입력 섹션 */}
      <div className="relative flex items-center">
        {/* 이미지 첨부 버튼 */}
        <label className="mr-2 cursor-pointer">
          <Image src="/assets/svg/Plus2.svg" alt="Attach" width={24} height={24} />
          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
        </label>

        {/* 텍스트 입력 */}
        <textarea
          ref={textareaRef}
          value={content}
          onFocus={handleFocus}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          className="max-h-[100px] min-h-[36px] w-full resize-none overflow-hidden rounded-full border border-gray-300 px-4 py-2 pr-12 text-base leading-6 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mainColor"
        />

        {/* 전송 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`absolute right-2 flex items-center justify-center rounded-full transition-opacity duration-300 ${
            sendMessage.isPending ? "opacity-50" : "opacity-100"
          }`}
        >
          <Image src="/assets/svg/Send.svg" alt="Send" width={24} height={24} />
        </button>
      </div>
    </form>
  );
};
