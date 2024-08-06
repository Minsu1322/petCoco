"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Link from "next/link";
import { MatePostsAndUsersResponse, PostsResponse } from "@/types/mainPageTypes/MainPageTypes";
import AnimalCarousel from "@/components/animalCarousel/AnimalCarousel";
import { EmblaOptionsType } from "embla-carousel";
import Image from "next/image";

export default function Home() {
  //메이트정보
  const fetchPostsMate = async () => {
    const response = await fetch("/api/mate?page=1&limit=5");
    console.log(response);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const {
    data: mateResponse,
    isLoading: isMateLoading,
    error: mateError
  } = useQuery<MatePostsAndUsersResponse, Error>({
    queryKey: ["matePosts"],
    queryFn: fetchPostsMate
  });

  //자유게시판 정보
  const fetchPosts = async () => {
    const response = await fetch("/api/community?page=1&limit=5");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, isLoading, error } = useQuery<PostsResponse, Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts
  });

  if (isLoading || isMateLoading) return <div>Loading...</div>;
  if (error || mateError) return <div>Error: {error?.message || mateError?.message}</div>;

  const OPTIONS: EmblaOptionsType = { align: "center", dragFree: true, loop: true, startIndex: 2 };
  const SLIDE_COUNT = 7;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-gray-100 p-4 sm:p-6 md:p-10">
      <div className="flex w-full flex-col items-center justify-center sm:w-full md:w-8/12">
        {/* 배너 영역 */}
        <Image
          src="https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/banner_img/banner004.png"
          alt="banner images"
          width={600}
          height={150}
          layout="responsive"
          className="rounded-lg"
        />
      </div>

      {/* 게시글 영역 */}
      <div className="flex w-full flex-col space-y-4 sm:space-y-6 md:w-8/12 md:flex-row md:space-x-4 md:space-y-0">
        {/* 자유게시판 */}
        <div className="w-full rounded-lg border border-gray-300 bg-white p-4 shadow-md sm:w-full md:w-1/2 md:p-6">
          <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/community`}>
            <h2 className="mb-4 border-b pb-2 text-xl font-bold hover:underline">방금 올라온 반려이야기😀</h2>
          </Link>

          {data?.data.slice(0, 5).map((post, index) => (
            <div key={post.id} className={`mb-3 w-full ${index !== 0 ? "border-t border-gray-200 pt-3" : ""}`}>
              <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/community/${post.id}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src={post.users.profile_img} alt="User Profile" className="h-8 w-8 rounded-md" />
                    <div>
                      <div className="cursor-pointer text-black hover:underline">{post.title}</div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{post.users.nickname}</span>
                        <span>-</span>
                        <span>댓글 {post.comments.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {post.post_imageURL[0] && (
                      <img src={post.post_imageURL[0]} alt="Post Image" className="h-12 w-12 rounded-md object-cover" />
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* 산책메이트 */}
        <div className="w-full rounded-lg border border-gray-300 bg-white p-4 shadow-md sm:w-full md:w-1/2 md:p-6">
          <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/mate`}>
            <h2 className="mb-4 border-b pb-2 text-xl font-bold hover:underline">산책메이트</h2>
          </Link>

          <div className="space-y-4 overflow-x-auto pb-4 md:grid md:grid-cols-1 md:gap-4 md:space-y-0">
            {mateResponse?.data.slice(0, 5).map((post, index) => {
              const user = post.users[0];
              return (
                <Link key={post.id} href={`${process.env.NEXT_PUBLIC_SITE_URL}/mate/posts/${post.id}`}>
                  <div
                    className={`flex items-center justify-between rounded-lg bg-gray-50 p-2 ${index !== 0 ? "border-t border-gray-200 pt-3" : ""}`}
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={
                          user?.profile_img ||
                          "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/profile_img/default-profile.jpg"
                        }
                        alt="User Profile"
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <div>
                        <div className="font-semibold">{post.title}</div>
                        <div className="text-xs text-gray-500">{post.place_name}</div>
                        <div className="text-xs text-gray-500">
                          {post.recruitment_start && new Date(post.recruitment_start).toLocaleDateString()} ~
                          {post.recruitment_end && new Date(post.recruitment_end).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">모집인원: {post.members}</div>
                      {post.recruiting ? (
                        <div className="rounded bg-green-200 px-2 py-1 text-xs text-green-700">모집중</div>
                      ) : (
                        <div className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700">모집완료</div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center sm:w-full md:w-8/12">
        <Image
          src="https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/banner_img/banner003.png"
          alt="banner images"
          width={600}
          height={150}
          layout="responsive"
          className="rounded-lg"
        />

        {/* 캐러셀 주석 처리 */}
        <div className="mt-2 w-full">
          <AnimalCarousel slides={SLIDES} options={OPTIONS} />
        </div>
      </div>
    </div>
  );
}
