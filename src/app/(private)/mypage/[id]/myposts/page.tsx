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

  return data; // API가 배열을 반환하므로 첫 번째 항목을 가져옵니다
};

const myPost: React.FC<PageProps> = async ({ params }) => {
  const { id } = params;
  const post = await fetchMyPosts(id);

  if (!post) return;

  return (
    <div className="ml-[570px] mt-24 flex h-[440px] w-[640px] flex-col items-center gap-4 overflow-y-scroll rounded-[10px] bg-gray-100 py-4 scrollbar-hide">
      {post.map((post) => (
        <div key={post.id} className="w-[440px] rounded-[10px] border border-[#4885f8] bg-white">
          <Link href={`/community/${post.id}`} className="ml-3 mt-5 flex flex-col justify-center">
            <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
            <p className="mb-2 text-gray-600">작성자: {post.users?.nickname}</p>
            <img className="max-h-[200px] max-w-[240px]" src={post.post_imageURL || ""} alt="" />
            <p className="mb-4 text-gray-600">작성일: {new Date(post.created_at).toLocaleString()}</p>
            <div className="prose max-w-none">
              <p>{post.content}</p>
            </div>
            <hr className="my-8" />
            <h2 className="mb-4 text-2xl font-semibold">댓글</h2>
            <Comments postId={id} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default myPost;
