"use client";

import { useQuery } from "@tanstack/react-query";
import MatePostList from "./_components/MatePostList";
import Post from "./_components/PostForm";
import Link from "next/link";

const MatePage = () => {
  // 커스텀 훅으로 빼기
  const {
    data: posts,
    isPending,
    error
  } = useQuery({
    queryKey: ["matePosts"],
    queryFn: async () => {
      const response = await fetch(`/api/mate`);
      const data = response.json();

      return data;
    }
  });

  if (isPending) {
    return <div>로딩 중,,,</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }
  //console.log(posts);

  return (
    <div>
      <div>
        <p>산책 메이트 확인하기</p>
        <div className="h-10 w-[180px] rounded-lg bg-blue-300 p-2 text-center">
          <Link href="/mate/posts">산책 메이트 구하기 🐾</Link>
          {/* <Post /> */}
        </div>
        <MatePostList posts={posts} />
      </div>
    </div>
  );
};

export default MatePage;
