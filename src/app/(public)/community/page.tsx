"use client";
import {
  handleTabIntroduction,
  sortCategory,
  tabs,
  tags
} from "@/components/community/communityTabAndSortTab/TabAndCategory";
import PostList from "./_components/PostList";
import React, { useState } from "react";
import Link from "next/link"; // Link 컴포넌트 추가
import { RiSearch2Line } from "react-icons/ri";

const CommunityMainPage = () => {
  const [selectedTab, setSelectedTab] = useState<string>("전체");
  const [selectedSort, setSelectedSort] = useState<string>("최신순");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>("");
  const [showMoreKeywords, setShowMoreKeywords] = useState<boolean>(false);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveSearchTerm(searchTerm);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {/* 제목탭 - 선택한 카테고리를 출력 */}
        <h1 className="text-4xl font-bold">{selectedTab}</h1>
      </div>

      <div className="flex">
        <div className="w-3/4 pr-8">
          {/* 정렬영역 - components의 TabAndCategory에서 관리 */}
          <div className="mb-8 flex items-center">
            <div className="space-x-2">
              {sortCategory.map((sort) => (
                <button
                  key={sort}
                  className={`h-[40px] rounded-full border border-gray-300 px-3 py-1 ${
                    selectedSort === sort ? "bg-mainColor text-white" : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedSort(sort)}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>

          {/* PostList 컴포넌트 */}
          <PostList selectedCategory={selectedTab} searchTerm={activeSearchTerm} selectedSort={selectedSort} />
        </div>

        <div className="w-1/4">
          {/* 글쓰기 버튼 */}
          <Link
            href="/community/createPost"
            className="mb-8 block w-full rounded-md bg-mainColor px-4 py-2 text-center text-black hover:bg-[#5e96ff]"
          >
            글쓰기
          </Link>

          {/* 검색영역 */}
          <form onSubmit={handleSearchSubmit} className="mb-8">
            <div className="flex overflow-hidden rounded-full border border-gray-300">
              <input
                type="text"
                placeholder="검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 focus:outline-none"
              />
              <button type="submit" className="w-autopx-4 mx-4 py-2">
                <RiSearch2Line />
              </button>
            </div>
          </form>

          {/* 최근 핫 키워드 */}
          <div className="mb-8">
            <h4 className="mb-4 text-lg font-semibold">최근 핫 키워드</h4>
            <div className="grid grid-cols-3 gap-2">
              {tabs.slice(0, showMoreKeywords ? undefined : 9).map((keyword, index) => (
                <button
                  key={keyword}
                  className={`h-[40px] rounded-full border px-2 py-1 text-sm ${
                    selectedTab === keyword
                      ? "border-mainColor bg-mainColor text-white"
                      : index === 8 && !showMoreKeywords
                        ? "border-gray-300 bg-gray-100 hover:bg-gray-200"
                        : "border-gray-300 bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    if (index === 8 && !showMoreKeywords) {
                      setShowMoreKeywords(true);
                    } else {
                      setSelectedTab(keyword);
                    }
                  }}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          {/* 희귀 동물 게시판 */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">희귀 동물 게시판</h4>
            <div className="grid grid-cols-3 gap-2">
              {tags.slice(0, showMoreKeywords ? undefined : 3).map((keyword) => (
                <button
                  key={keyword}
                  className={`h-[40px] rounded-full border px-2 py-1 text-sm ${
                    selectedTab === keyword
                      ? "border-mainColor bg-mainColor text-white"
                      : "border-gray-300 bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedTab(keyword)}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMainPage;
