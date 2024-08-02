"use client";

import Image from "next/image";
import { Comment } from "@/types/TypeOfCommunity/CommunityTypes";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";

const supabase = createClient();

interface CommentsProps {
  postId: string;
}

const fetchComments = async (postId: string): Promise<Comment[]> => {
  const response = await fetch(`/api/comments?id=${postId}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: initialComments,
    error,
    isLoading
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId)
  });

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<{ [key: string]: string }>({});
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (initialComments) {
      setComments(initialComments);
    }
  }, [initialComments]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleAddComment = async () => {
    if (!newComment || newComment.trim() === "") {
      alert("댓글을 입력해주세요.");
      return;
    }
    const { data, error } = await supabase.from("comments").insert([
      {
        post_id: postId,
        user_id: user.id,
        content: newComment
      }
    ]);

    if (error) {
      console.error("댓글을 등록하는 중 오류가 발생했습니다 :", error);
      return;
    }

    if (data) {
      setComments([...comments, data[0]]);
    }
    setNewComment("");
    queryClient.invalidateQueries({ queryKey: ["comments", postId] });
  };

  const handleEditComment = async (id: string) => {
    const { data, error } = await supabase.from("comments").update({ content: editingComment[id] }).eq("id", id);

    if (error) {
      console.error("Error editing comment:", error);
      return;
    }

    setComments(comments.map((comment) => (comment.id === id ? { ...comment, content: editingComment[id] } : comment)));
    setEditingComment((prev) => ({ ...prev, [id]: "" }));
    setIsEditing((prev) => ({ ...prev, [id]: false }));
    queryClient.invalidateQueries({ queryKey: ["comments", postId] });
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`/api/comments?id=${id}`, {
          method: "DELETE"
        });

        if (response.ok) {
          alert("삭제가 완료되었습니다.");
          queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.error(err);
        alert("삭제 중 오류가 발생했습니다.");
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      }
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button onClick={handleAddComment}>댓글 작성</button>
      </div>

      {!comments || comments.length === 0 ? (
        <div>아무 댓글이 없어요!</div>
      ) : (
        comments
          .slice() // 원본 배열을 변경하지 않기 위해 복사본을 만듭니다.
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // created_at을 기준으로 정렬합니다.
          .map((comment) => (
            <div key={comment.id}>
              {
                <Image
                  src={
                    comment.users.profile_img ||
                    "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/post_image/1722324396777_xo2ka9.jpg"
                  }
                  alt={comment.users.nickname}
                  width={74}
                  height={74}
                  className="rounded-full"
                />
              }
              <p>닉네임: {comment.users.nickname}</p>
              <p>댓글: {comment.content}</p>
              <small>{new Date(comment.created_at).toLocaleString()}</small>
              {user.id === comment.user_id && (
                <div className="mb-4 flex flex-row gap-x-5">
                  <button
                    onClick={() => {
                      setEditingComment((prev) => ({ ...prev, [comment.id]: comment.content }));
                      setIsEditing((prev) => ({ ...prev, [comment.id]: true }));
                    }}
                    className="flex h-8 w-16 cursor-pointer items-center justify-center rounded-md bg-editBtnColor p-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="flex h-8 w-16 cursor-pointer items-center justify-center rounded-md bg-delBtnColor p-2"
                  >
                    삭제
                  </button>
                </div>
              )}
              {isEditing[comment.id] && (
                <div>
                  <input
                    type="text"
                    value={editingComment[comment.id] ?? ""}
                    onChange={(e) => setEditingComment((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                  />
                  <button onClick={() => handleEditComment(comment.id)}>수정 완료</button>
                </div>
              )}
            </div>
          ))
      )}
    </div>
  );
};

export default Comments;
