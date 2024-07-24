import Comments from "@/components/community/[id]/Comment";
import React from "react";

interface PageProps {
  params: { id: string };
}

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  users: {
    nickname: string;
  };
  // 필요한 다른 필드들을 여기에 추가하세요
}

const fetchPost = async (postId: string): Promise<Post> => {
  const response = await fetch(`http://localhost:3000/api/detailCommunity?id=${postId}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data[0]; // API가 배열을 반환하므로 첫 번째 항목을 가져옵니다
};

const CommunityMain: React.FC<PageProps> = async ({ params }) => {
  const { id } = params;
  const post = await fetchPost(id);

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      <p className="mb-2 text-gray-600">작성자: {post.users.nickname}</p>
      <p className="mb-4 text-gray-600">작성일: {new Date(post.created_at).toLocaleString()}</p>
      <div className="prose max-w-none">
        <p>{post.content}</p>
      </div>
      <hr className="my-8" />
      <h2 className="mb-4 text-2xl font-semibold">댓글</h2>
      <Comments postId={id} />
    </div>
  );
};

export default CommunityMain;
