"use client";
import {
  handleTabIntroduction,
  sortCategory,
  tabs
} from "@/components/community/communityTabAndSortTab/TabAndCategory";
import PostList from "@/components/community/PostList";
import React, { useState } from "react";

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

        {/* 서브제목(소개글) - components의 TabAndCategory에서 관리 */}
        <h3 className="mt-2 text-xl text-[#67C047] underline decoration-[rgba(103,192,71,0.8)]">
          {handleTabIntroduction(selectedTab)}
        </h3>
      </div>

      <div className="flex">
        <div className="w-3/4 pr-8">
          {/* 정렬영역 - components의 TabAndCategory에서 관리 */}
          <div className="mb-8 flex items-center">
            <div className="space-x-2">
              {sortCategory.map((sort) => (
                <button
                  key={sort}
                  className={`rounded-md border border-gray-300 px-3 py-1 ${
                    selectedSort === sort ? "bg-[#67C047] text-white" : "bg-white hover:bg-gray-100"
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
          <button className="mb-8 w-full rounded-md bg-[#67C047] px-4 py-2 text-white hover:bg-[#5AAF3F]">
            글쓰기
          </button>

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
              <button type="submit" className="w-auto bg-[#67C047] px-4 py-2 text-white">
                검색
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
                  className={`rounded-md border border-gray-300 px-2 py-1 text-sm ${
                    index === 8 && !showMoreKeywords ? "bg-gray-100 hover:bg-gray-200" : "bg-white hover:bg-gray-100"
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
            <button className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm hover:bg-gray-100">
              거북이
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMainPage;
