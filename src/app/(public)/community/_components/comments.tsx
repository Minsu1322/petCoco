"use client";

import Image from "next/image";
import { Comment } from "@/types/TypeOfCommunity/CommunityTypes";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import Swal from "sweetalert2";

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
      title: '댓글 삭제',
      text: "정말로 이 댓글을 삭제하시겠습니까?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor:'#d33',
      cancelButtonColor: '#c0c0c0',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
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
    <div className="">
      <div className="flex justify-between">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="h-[50px] w-[800px] rounded-md border pl-5"
        />
        <button onClick={handleAddComment} className="ml-5 h-[50px] w-[150px] rounded-md bg-mainColor">
          댓글 작성
        </button>
      </div>

      {!comments || comments.length === 0 ? (
        <div>아무 댓글이 없어요!</div>
      ) : (
        comments
          .slice() // 원본 배열을 변경하지 않기 위해 복사본을 만듭니다.
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // created_at을 기준으로 정렬합니다.
          .map((comment) => (
            <div key={comment.id} className="mt-5 rounded-md border border-mainColor">
              <div className="mx-5 mt-5 flex items-center justify-between">
                <div className="flex items-center">
                  {
                    <Image
                      src={
                        comment.users?.profile_img ||
                        "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/post_image/1722324396777_xo2ka9.jpg"
                      }
                      alt={comment.users?.nickname}
                      width={50}
                      height={50}
                      className="mr-3 rounded-full"
                    />
                  }
                  <div className="flex flex-col">
                    <p className="font-semibold">{comment.users?.nickname}</p>
                    <small className="float-end text-gray-400">{new Date(comment.created_at).toLocaleString()}</small>
                  </div>
                </div>
                {user.id === comment.user_id && (
                  <div className="flex flex-row items-center gap-x-5">
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
              </div>
              <div>
                <div className="mx-5 my-8 rounded-md bg-[#f7faff] p-4">
                  <p>{comment.content}</p>
                </div>
              </div>

              {isEditing[comment.id] && (
                <div className="mx-5 my-5 flex justify-between">
                  <input
                    type="text"
                    value={editingComment[comment.id] ?? ""}
                    className="h-[50px] w-[800px] rounded-md border pl-5"
                    onChange={(e) => setEditingComment((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                  />
                  <button
                    onClick={() => handleEditComment(comment.id)}
                    className="h-[50px] w-[100px] rounded-md bg-mainColor"
                  >
                    수정 완료
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
