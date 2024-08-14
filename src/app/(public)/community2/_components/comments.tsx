"use client";

import Image from "next/image";
import { Comment } from "@/types/TypeOfCommunity/CommunityTypes";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import Swal from "sweetalert2";
import { getTimeDifference } from "@/app/utils/getTimeDifference";

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

  const handleKeyPressForAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddComment();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, commentId: string) => {
    if (e.key === "Enter") {
      handleEditComment(commentId);
    }
  };

  const handleAddComment = async () => {
    if (!newComment || newComment.trim() === "") {
      // alert("댓글을 입력해주세요.");
      Swal.fire({
        title: "댓글을 입력해주세요!",
        text: "댓글 내용을 확인해 주세요.",
        icon: "warning"
      });
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
    Swal.fire({
      title: "댓글 삭제",
      text: "정말로 이 댓글을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#c0c0c0",
      confirmButtonText: "삭제",
      cancelButtonText: "취소"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/comments?id=${id}`, {
            method: "DELETE"
          });

          if (response.ok) {
            Swal.fire({
              title: "완료!",
              text: "댓글이 삭제되었습니다",
              icon: "success"
            });

            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "오류가 발생했습니다!",
            text: "댓글 삭제 중 오류가 발생했습니다.",
            icon: "error"
          });
          queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        }
      }
    });
  };

  return (
    <div className="mb-20">
      <div className="flex justify-between rounded-[0.75rem] border border-mainColor px-4 py-[0.62rem] text-[0.875rem]">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleKeyPressForAdd}
          placeholder="댓글을 입력해주세요"
          className="placeholder-[#D2CDF6] focus:outline-none"
        />
        <button
          onClick={handleAddComment}
          className="rounded-[0.75rem] bg-mainColor px-[0.88rem] py-[0.38rem] text-white"
        >
          등록
        </button>
      </div>

      <div className="flex gap-[0.25rem] py-[1.32rem] text-[#AFB1B6]">
        <img src="/assets/svg/comment.svg" />
        <div>댓글 {comments.length}</div>
      </div>

      {/* 댓글 컴포넌트 시작 */}
      {!comments || comments.length === 0 ? (
        <div className="mt-5 flex w-full justify-center">
          <p className="text-[0.75rem]">아무 댓글이 없어요. 댓글을 남겨보세요!</p>
        </div>
      ) : (
        comments
          .slice() // 원본 배열을 변경하지 않기 위해 복사본을 만듭니다.
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // created_at을 기준으로 정렬합니다.
          .map((comment) => (
            <div key={comment.id} className="border-b-1">
              <div className="flex gap-[0.75rem] py-4">
                {/* 프로필 이미지 */}
                <div className="flex w-full items-center gap-[0.75rem]">
                  {
                    <Image
                      src={
                        comment.users?.profile_img ||
                        "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/post_image/1722324396777_xo2ka9.jpg"
                      }
                      alt={comment.users?.nickname}
                      width={50}
                      height={50}
                      className="h-[1.75rem] w-[1.75rem] rounded-full"
                    />
                  }

                  {/* 중간 부분 */}
                  <div className="gap-[0.25rem]">
                    {/* 중간 부분 윗줄 */}
                    <div className="flex gap-[0.25rem]">
                      <p className="text-[0.75rem] text-mainColor">{comment.users?.nickname}</p>
                      <small className="text-[0.625rem]">{getTimeDifference(comment.created_at)}</small>
                    </div>
                    {/* 중간 내용 아랫줄 */}
                    <div className="text-[0.875rem]">
                      <p>{comment.content}</p>
                    </div>
                  </div>
                </div>

                {/* 수정 삭제 */}
                {user.id === comment.user_id && (
                  <div className="flex h-full gap-[0.75rem] whitespace-nowrap text-[0.75rem]">
                    <button
                      onClick={() => {
                        setEditingComment((prev) => ({ ...prev, [comment.id]: comment.content }));
                        setIsEditing((prev) => ({ ...prev, [comment.id]: true }));
                      }}
                      className="text-[#11BBB0]"
                    >
                      수정
                    </button>
                    <button onClick={() => handleDelete(comment.id)} className="text-[#FFB9B9]">
                      삭제
                    </button>
                  </div>
                )}
              </div>

              {/* 수정 화면 */}
              {isEditing[comment.id] && (
                <div className="mb-[0.5rem] flex justify-center gap-[0.5rem] rounded-[0.75rem] border border-[#D2CDF6] px-[0.5rem] py-[0.4rem]">
                  <input
                    type="text"
                    value={editingComment[comment.id] ?? ""}
                    className="focus:outline-none"
                    onChange={(e) => setEditingComment((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                    onKeyPress={(e) => handleKeyPress(e, comment.id)}
                  />
                  <button onClick={() => handleEditComment(comment.id)} className="text-[0.75rem] text-[#11BBB0]">
                    수정완료
                  </button>
                </div>
              )}
            </div>
          ))
      )}
    </div>
  );
};

export default Comments;
