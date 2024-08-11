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

const categoryStyles: { [key: string]: string } = {
  자유: "bg-[#D1FFA2] text-[#8E6EE8]",
  자랑: "bg-[#B1D0FF] text-[#8E6EE8]",
  고민: "bg-[#D2CDF6] text-[#8E6EE8]",
  신고: "bg-[#FFB9B9] text-[#8E6EE8]"
  // 추가적인 카테고리가 필요한 경우 여기에 추가 가능
};

const fetchPosts = async (page: number, category: string, searchTerm: string, sort: string): Promise<PostsResponse> => {
  const url =
    sort === "댓글순"
      ? `/api/sortByComments?page=${page}&limit=10&category=${category}&search=${searchTerm}`
      : `/api/community?page=${page}&limit=10&category=${category}&search=${searchTerm}`;

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

  return (
    <div className="w-full rounded-lg bg-white p-4 shadow-md">
      {data?.data.slice(0, 10).map((post, index) => (
        <div key={post.id} className={`mb-3 w-full ${index !== 0 ? "border-t border-gray-200 pt-3" : ""}`}>
          <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/community/${post.id}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`rounded-full px-2 py-1 text-sm font-bold ${
                    categoryStyles[post.category] || "bg-gray-200 text-black"
                  }`}
                >
                  {post.category}
                </span>
                <div>
                  <div className="max-w-[200px] cursor-pointer truncate text-black hover:underline">{post.title}</div>
                  <div className="flex items-center space-x-2 text-xs text-[#8E6EE8]">
                    <span>{post.users.nickname}</span>
                    <span>-</span>
                    <span>댓글 {post.comments?.length}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {post?.post_imageURL?.[0] && (
                  <img src={post?.post_imageURL[0]} alt="Post Image" className="h-12 w-12 rounded-md object-cover" />
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PostList;
