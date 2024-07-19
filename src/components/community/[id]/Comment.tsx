"use client";

import { Comment } from "@/types/TypeOfCommunity/CommunityTypes";
import { useQuery } from "@tanstack/react-query";
import React from "react";

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
  const {
    data: comments,
    error,
    isLoading
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId)
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!comments || comments.length === 0) return <div>아무 댓글이 없어요!</div>;

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>닉네임: {comment.users.nickname}</p>
          <p>댓글: {comment.content}</p>
          <small>{new Date(comment.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default Comments;
