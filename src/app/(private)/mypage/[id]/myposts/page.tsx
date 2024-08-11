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
    <div className="mb-[30px] flex h-[80%] flex-col items-center gap-4 overflow-y-scroll rounded-[10px] scrollbar-hide sm:w-[640px]">
      {post.map((post) => (
        <div key={post.id} className="border-gray rounded-[10px] border bg-white sm:w-[440px]">
          <Link href={`/community/${post.id}`} className="flex flex-col items-center justify-center">
            <div className="h-[90%] w-[90%] py-5">
              <h1 className="mb-4 text-2xl font-semibold">{post.title}</h1>
              <p className="mb-2 text-gray-600">작성자: {post.users?.nickname}</p>
              <img className="max-h-[200px] max-w-[240px]" src={post.post_imageURL || ""} alt="" />
              <p className="mb-4 text-gray-600">작성일: {new Date(post.created_at).toLocaleString()}</p>
              <div className="mt-2 h-[150px] overflow-y-auto rounded-lg bg-[#eef4ff] p-4 scrollbar-hide">
                <p>{post.content}</p>
              </div>
              {/* <hr className="my-8" />
              <h2 className="mb-4 text-2xl font-semibold">댓글</h2>
              <Comments postId={id} /> */}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default myPost;
