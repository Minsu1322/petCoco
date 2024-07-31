import Comments from "@/components/community/[id]/Comment";
import { createClient } from "@/supabase/server";
import { Tables } from "@/types/supabase";
import Link from "next/link";
import { useParams } from "next/navigation";
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

const fetchMyPosts = async (userId: string): Promise<Tables<"posts">[] | null> => {
  const supabase = createClient();
  console.log("id", userId);

  const { data, error } = await supabase.from("posts").select("*").eq("user_id", userId);

  return data; // API가 배열을 반환하므로 첫 번째 항목을 가져옵니다
};

const myPost: React.FC<PageProps> = async ({ params }) => {
  const { id } = params;
  const post = await fetchMyPosts(id);
  console.log("post : ", post);
  if (!post) return;

  return (
    <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md">
      {post.map((post) => (
        <Link href={`/community/${post.id}`}>
          <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
          {/* <p className="mb-2 text-gray-600">작성자: {post.users.nickname}</p> */}
          <img src={post.post_imageURL || ""} alt="" />
          <p className="mb-4 text-gray-600">작성일: {new Date(post.created_at).toLocaleString()}</p>
          <div className="prose max-w-none">
            <p>{post.content}</p>
          </div>
          <hr className="my-8" />
          {/* <h2 className="mb-4 text-2xl font-semibold">댓글</h2>
          <Comments postId={id} /> */}
        </Link>
      ))}
    </div>
  );
};

export default myPost;
