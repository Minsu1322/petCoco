"use client";

import { useQuery } from "@tanstack/react-query";

import Link from "next/link";
import MatePostList from "./_components/matePostList";
import SearchBar from "./_components/searchBar";
import { useState } from "react";

import { MatePostFullType } from "@/types/mate.type";

const MatePage = () => {
  // 커스텀 훅으로 빼기
  const {
    data: allPosts,
    isPending,
    error
  } = useQuery<MatePostFullType[]>({
    queryKey: ["matePosts"],
    queryFn: async () => {
      const response = await fetch(`/api/mate`);
      const data = response.json();

      return data;
    }
  });

  const [isCurrentPosts, setIstCurrentPosts] = useState<boolean>(true);
  const currentPosts = allPosts?.filter(post => post.recruiting === true) || [];

  const handleDateSort = () => {
    //
  };

  const handleToggleAllPosts = () => {
    setIstCurrentPosts(!isCurrentPosts);
  };

  if (isPending) {
    return <div>로딩 중,,,</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }
  //console.log(posts);

  return (
    <div className="mx-8">
      <h1 className="mb-5 text-center text-2xl">산책 메이트</h1>
      <div className="mx-12">
        <SearchBar />
        <div className="flex flex-row justify-between">
          <Link href="/mate/posts" className="mb-4 h-10 w-[180px] rounded-lg bg-mainColor p-2 text-center">
            <div>글쓰기 🐾</div>
          </Link>
        </div>
        <div className="mb-3 flex flex-row justify-between">
          <div className="cursor-pointer" onClick={handleToggleAllPosts}>{isCurrentPosts ? '모집 완료된 메이트도 보기' : '모집 중인 메이트만 보기'}</div>
          <div className="flex flex-row gap-x-2">
            <div onClick={handleDateSort}>마감 임박순</div>
            <p>|</p>
            <div>가까운 순</div>
          </div>
        </div>
      </div>
      <MatePostList posts={isCurrentPosts ? currentPosts : allPosts} />
    </div>
  );
};

export default MatePage;
