"use client";

import { useState } from "react";
import { useAuthStore } from "@/zustand/useAuth";

import Link from "next/link";
import MatePostList from "./_components/post/matePostList";
import PostListFilterTab from "./_components/postListFilterTab";
import PostItemFilterTab from "./_components/postItemFilterTab";
import NotLogInView from "./_components/notLogInView";

export type PositionData = {
  center: {
    lat: number;
    lng: number;
  };
  errMsg?: string;
  isLoading: boolean;
} | null;

const MatePage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCurrentPosts, setIstCurrentPosts] = useState<boolean>(true);
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState("");

  const { user } = useAuthStore();

  const [filters, setFilters] = useState({
    gender: null,
    age: null,
    date_time: undefined,
    male_female: null,
    weight: null,
  });

  const updateFilter = (filterName: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  const handleSearchPosts = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveSearchTerm(searchQuery);
    setSearchQuery("");
  };

  const handleToggleAllPosts = () => setIstCurrentPosts(!isCurrentPosts);
  const handleDateSort = () =>setSortBy("recruitment_period");
  const handleDistanceSort = () => setSortBy("distance");
  
  const handleResetFilter = () => {
    setFilters({
      gender: null,
      age: null,
      date_time: undefined,
      male_female: null,
      weight: null
    });
  };

  if (user === null) {
    return <NotLogInView />;
  }

  return (
    <div className="min-h-screen mb-10 container mx-auto ">
      <h1 className="mb-7 p-2 text-3xl font-semibold">산책 메이트</h1>
      <div className="flex flex-row gap-x-5">
        {/* 왼쪽 메인 컨텐츠 영역 */}
        <div className="w-3/4  mx-3">
          <div className="mb-5">
            <PostListFilterTab
              isCurrentPosts={isCurrentPosts}
              handleToggleAllPosts={handleToggleAllPosts}
              handleDateSort={handleDateSort}
              handleDistanceSort={handleDistanceSort}
            />
          </div>
          <MatePostList
            activeSearchTerm={activeSearchTerm}
            isCurrentPosts={isCurrentPosts}
            sortBy={sortBy}
            filters={filters}
          />
        </div>
        {/* 가운데 사이드 선 */}
        <div className="border-l-2 border-gray-100 h-screen mx-3"><br /></div>
        {/* 오른쪽 사이드바 영역 */}
        <div className="w-1/4 pl-5 mr-8">
          <div className="mt-1 flex">
            <Link href="/mate/posts" className="mb-4 h-10 w-full items-center rounded-lg bg-mainColor p-2 text-center">
              <div>글쓰기</div>
            </Link>
          </div>
          <div className="mb-5 flex flex-col">
            <p className="text-lg mt-3 text-gray-500">검색</p>
            <form onSubmit={handleSearchPosts} className="flex w-full flex-row items-center rounded-full border p-1 mt-3 h-12">
              <input
                type="text"
                className="w-full ml-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="mx-4">
                🔍
              </button>
            </form>
          </div>
          <PostItemFilterTab updateFilter={updateFilter} filters={filters} onClick={handleResetFilter} />
          
        </div>
      </div>
    </div>
  );
};

export default MatePage;
