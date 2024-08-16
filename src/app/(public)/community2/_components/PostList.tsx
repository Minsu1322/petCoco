"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PostsResponse } from "@/types/TypeOfCommunity/CommunityTypes";
import { scrollToTop } from "@/app/utils/scrollToTop";
import PlusIcon from "@/app/utils/plusIcon";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/loadingComponents/Loading";

interface PostListProps {
  selectedCategory: string;
  searchTerm: string;
  selectedSort: string;
}

const categoryStyles: { [key: string]: string } = {
  자유: "bg-[#D1FFA2] text-[#5219F7]",
  자랑: "bg-[#B1D0FF] text-[#5219F7]",
  고민: "bg-[#D2CDF6] text-[#5219F7]",
  신고: "bg-[#FFB9B9] text-[#5219F7]"
  // 추가적인 카테고리가 필요한 경우 여기에 추가 가능
};

// const fetchPosts = async (page: number, category: string, searchTerm: string, sort: string): Promise<PostsResponse> => {
//   const url =
//     sort === "댓글순"
//       ? `/api/sortByComments?page=${page}&limit=100&category=${category}&search=${searchTerm}`
//       : `/api/community?page=${page}&limit=100&category=${category}&search=${searchTerm}`;

const fetchPosts = async (page: number, category: string, searchTerm: string, sort: string): Promise<PostsResponse> => {
  let url;
  if (sort === "댓글순") {
    url = `/api/sortByComments?page=${page}&limit=10&category=${category}&search=${searchTerm}`;
  } else if (sort === "좋아요순") {
    url = `/api/sortByLikes?page=${page}&limit=10&category=${category}&search=${searchTerm}`;
  } else {
    url = `/api/community?page=${page}&limit=10&category=${category}&search=${searchTerm}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("메인페이지오류");
  }
  return response.json();
};

const PostList: React.FC<PostListProps> = ({ selectedCategory, searchTerm, selectedSort }) => {
  const router = useRouter();
  const observerTarget = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery<
    PostsResponse,
    Error
  >({
    queryKey: ["posts", selectedCategory, searchTerm, selectedSort],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam as number, selectedCategory, searchTerm, selectedSort),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.data.length === 10 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [handleObserver]);

  const handleLoginCheck = () => {
    router.push("/community2/createPost");
  };

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
      <div className="mt-[15%] flex h-full items-center justify-center">
        <LoadingComponent />
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

  const allPosts = data?.pages.flatMap((page) => page.data) || [];
  const sortedPosts = sortPosts(allPosts);
  return (
    <>
      {/* {data?.data.map((post, index) => ( */}
      {sortedPosts.map((post, index) => (
        <div key={post.id}>
          <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/community2/${post.id}`}>
            <div className="flex w-full items-center gap-[1.06rem] border-b-[1px] py-[0.75rem]">
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
                  <div className="text-mainColor">{post.users.nickname}</div>
                  <div className="flex gap-[0.25rem]">
                    <img src="/assets/svg/comment.svg" />
                    <div>{post.comments?.length}</div>
                  </div>
                  <div className="flex gap-[0.25rem]">
                    <img src="/assets/svg/heart.svg" />
                    {/* 게시글 좋아요 개수를 보여주는 부분 */}
                    <div>{post.likes?.length}</div>
                    {/* <div>12</div> */}
                  </div>
                </div>
              </div>

              {/* 이미지 */}
              <div className="h-[2.75rem] w-[2.75rem] shrink-0">
                {post?.post_imageURL?.[0] && (
                  <img
                    src={post?.post_imageURL[0]}
                    alt="Post Image"
                    className="h-full w-full rounded-[0.22rem] bg-blue-200 object-cover"
                  />
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}
      <div ref={observerTarget} className="h-10 w-full">
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-t-4 border-solid border-mainColor"></div>
          </div>
        )}
      </div>
      <div>
        <div className="mb-[80px] flex w-full justify-center">
          <button
            onClick={scrollToTop}
            className="fixed bottom-[8rem] flex items-center gap-[0.25rem] rounded-full bg-[#F3F2F2] px-[0.5rem] py-[0.25rem] text-[1rem] text-mainColor shadow-lg"
          >
            <p>맨위로</p>
            <img src="/assets/svg/chevron-left.svg" alt="..." />
          </button>
        </div>
        <PlusIcon handleLoginCheck={handleLoginCheck} />
      </div>
    </>
  );
};

export default PostList;
