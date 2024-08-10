"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PostsResponse } from "@/types/TypeOfCommunity/CommunityTypes";

interface PostListProps {
  selectedCategory: string;
  searchTerm: string;
  selectedSort: string;
}

const fetchPosts = async (page: number, category: string, searchTerm: string, sort: string): Promise<PostsResponse> => {
  const url =
    sort === "댓글순"
      ? `/api/sortByComments?page=${page}&limit=3&category=${category}&search=${searchTerm}`
      : `/api/community?page=${page}&limit=3&category=${category}&search=${searchTerm}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("메인페이지오류");
  }
  return response.json();
};

const PostList: React.FC<PostListProps> = ({ selectedCategory, searchTerm, selectedSort }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useQuery<PostsResponse, Error>({
    queryKey: ["posts", page, selectedCategory, searchTerm, selectedSort],
    queryFn: () => fetchPosts(page, selectedCategory, searchTerm, selectedSort)
  });

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchTerm, selectedSort]);

  const sortPosts = (posts: any[]) => {
    if (selectedSort === "최신순") {
      return [...posts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (selectedSort === "댓글순") {
      return [...posts].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    }
    return posts;
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-t-4 border-solid border-mainColor"></div>
          <p className="text-lg font-semibold text-mainColor">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-100">
        <div className="max-w-xs rounded-lg bg-white p-4 text-center shadow-md">
          <h2 className="font-bold text-red-600">에러 발생</h2>
          <p className="text-sm text-red-600">{error.message}</p>
          <svg className="mx-auto my-2 h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <button
            className="rounded bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const sortedPosts = sortPosts([...(data?.data || [])]);

  return (
    <div className="flex w-full items-center gap-[1.06rem] border-b-[1px] py-[0.75rem]">
      {/* 일상 */}
      <p className="whitespace-nowrap rounded-full bg-yellow-200 px-[0.5rem] py-[0.25rem] text-[0.75rem] text-mainColor">
        일상
      </p>

      {/* 가운데 내용 */}
      <div className="w-full">
        <div className="text-[1rem] leading-6">우리 뽀미 머리 어때요?</div>

        {/* 가운데 내용 아랫줄 */}
        <div className="flex gap-[0.25rem] text-[0.75rem] text-[#D2CDF6]">
          <div className="text-mainColor">닉네임</div>
          <div className="flex gap-[0.25rem]">
            <img src="/assets/svg/comment.svg" />
            <div>12</div>
          </div>
          <div className="flex gap-[0.25rem]">
            <img src="/assets/svg/heart.svg" />
            <div>12</div>
          </div>
        </div>
      </div>

      {/* 이미지 */}
      <div>
        <div className="rounded-[0.22rem h-[2.75rem] w-[2.75rem] bg-blue-200"></div>
      </div>
    </div>
  );
};

export default PostList;
