import Comments from "@/components/community/[id]/Comment";
import { createClient } from "@/supabase/server";
import { Tables } from "@/types/supabase";
import { Post } from "@/types/TypeOfCommunity/CommunityTypes";
import Image from "next/image";

import Link from "next/link";
import React from "react";

interface PageProps {
  params: { id: string };
}
type Posts = Tables<"posts">[];

interface PostListProps {
  selectedCategory: string;
  searchTerm: string;
  selectedSort: string;
  params: { id: string };
}

const categoryStyles: { [key: string]: string } = {
  자유: "bg-[#D1FFA2] text-[#8E6EE8]",
  자랑: "bg-[#B1D0FF] text-[#8E6EE8]",
  고민: "bg-[#D2CDF6] text-[#8E6EE8]",
  신고: "bg-[#FFB9B9] text-[#8E6EE8]"
  // 추가적인 카테고리가 필요한 경우 여기에 추가 가능
};

const fetchMyPosts = async (userId: string) => {
  const supabase = createClient();
  console.log("id", userId);

  const { data, error } = await supabase.from("posts").select("*,users(*)").eq("user_id", userId);

  return data; // API가 배열을 반환하므로 첫 번째 항목을 가져옵니다
};

const MyPosts: React.FC<PageProps> = async ({ params }) => {
  const { id } = params;
  const post = await fetchMyPosts(id);

  if (!post) return;

  return (
    <div>
      {post.map((post, index) => (
        <div className="px-6" key={post.id}>
          <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/community2/${post.id}`}>
            <div className="flex w-full items-center gap-[1.06rem] border-t-[1px] py-[0.75rem]">
              {/* 일상 */}
              <span
                className={`whitespace-nowrap rounded-full px-[0.5rem] py-[0.25rem] text-[0.75rem] ${
                  categoryStyles[post.category] || "bg-gray-200 text-black"
                }`}
              >
                {post.category}
              </span>
              {/* <p className="whitespace-nowrap rounded-full bg-yellow-200 px-[0.5rem] py-[0.25rem] text-[0.75rem] text-mainColor">
					{post.category}
				  </p> */}

              {/* 가운데 내용 */}
              <div className="w-full">
                <div className="text-[1rem] leading-6">{post.title}</div>

                {/* 가운데 내용 아랫줄 */}
                <div className="flex gap-[0.25rem] text-[0.75rem] text-[#D2CDF6]">
                  <div className="text-mainColor">{post.users?.nickname}</div>
                  <div className="flex gap-[0.25rem]">
                    <img src="/assets/svg/comment.svg" />
                    {/* <div>{post.comments?.length}</div> */}
                  </div>
                  <div className="flex gap-[0.25rem]">
                    <img src="/assets/svg/heart.svg" />
                    <div>12</div>
                  </div>
                </div>
              </div>

              {/* 이미지 */}
              {/* <div>
                {post?.post_imageURL?.[0] && (
                  <Image
                    src={post?.post_imageURL}
                    alt="Post Image"
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-md bg-blue-200"
                  />
                )}
              </div> */}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MyPosts;
