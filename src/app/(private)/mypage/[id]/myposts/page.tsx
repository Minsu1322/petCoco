import Comments from "@/components/community/[id]/Comment";
import { createClient } from "@/supabase/server";
import { Tables } from "@/types/supabase";
import { Post } from "@/types/TypeOfCommunity/CommunityTypes";

import Link from "next/link";
import React from "react";

interface PageProps {
  params: { id: string };
}
type Posts = Tables<"posts">[];

const fetchMyPosts = async (userId: string) => {
  const supabase = createClient();
  console.log("id", userId);

  const { data, error } = await supabase.from("posts").select("*,users(*)").eq("user_id", userId);
  console.log(data);
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
