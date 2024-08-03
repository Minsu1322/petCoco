"use client";

import { useState } from "react";
import { useAuthStore } from "@/zustand/useAuth";

import Link from "next/link";
import MatePostList from "./_components/post/matePostList";
import PostListFilterTab from "./_components/tab/postListFilterTab";
import PostItemFilterTab from "./_components/tab/postItemFilterTab";
import NotLogInView from "./_components/notLogInView";

import { RiSearch2Line } from "react-icons/ri";

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
    regions: null
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
  const handleDateSort = () => setSortBy("recruitment_end");
  const handleDistanceSort = () => setSortBy("distance");

  const handleResetFilter = () => {
    setFilters({
      gender: null,
      age: null,
      date_time: undefined,
      male_female: null,
      weight: null,
      regions: null
    });
    setSortBy("");
  };

  if (user === null) {
    return <NotLogInView />;
  }

  return (
    <div className="container mx-auto mb-10 min-h-screen px-2">
      <h1 className="mb-7 mt-5 p-2 text-2xl font-semibold md:text-3xl">산책 메이트</h1>
      <div className="flex flex-col gap-y-5 lg:flex-row lg:gap-x-5">
        {/* 왼쪽 메인 컨텐츠 영역 */}
        <div className="mx-0 w-full lg:mx-2 lg:w-3/4">
          <div className="mb-5">
            <PostListFilterTab
              isCurrentPosts={isCurrentPosts}
              handleToggleAllPosts={handleToggleAllPosts}
              handleDateSort={handleDateSort}
              handleDistanceSort={handleDistanceSort}
            />
          </div>
          <div>
            <MatePostList
              activeSearchTerm={activeSearchTerm}
              isCurrentPosts={isCurrentPosts}
              sortBy={sortBy}
              filters={filters}
            />
          </div>
        </div>
        {/* 가운데 사이드 선 */}
        <div className="mx-3 hidden h-screen border-l-2 border-gray-100 lg:block">
          <br />
        </div>
        {/* 오른쪽 사이드바 영역 */}
        <div className="mr-0 w-full pl-0 lg:mr-8 lg:w-1/4 lg:pl-5">
          {/* 글쓰기 버튼 영역 */}
          <div className="mt-1 flex">
            <Link href="/mate/posts" className="mb-4 h-10 w-full items-center rounded-lg bg-mainColor p-2 text-center">
              <div>글쓰기</div>
            </Link>
          </div>
          {/* 검색 영역 */}
          <div className="mb-5 flex flex-col">
            <p className="mt-3 text-lg text-gray-500">검색</p>
            <form
              onSubmit={handleSearchPosts}
              className="mt-3 flex h-12 w-full flex-row items-center rounded-full border p-1"
            >
              <input
                type="text"
                className="ml-3 w-full focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="mx-4">
                <RiSearch2Line />
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
