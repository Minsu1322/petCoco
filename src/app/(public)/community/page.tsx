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

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveSearchTerm(searchTerm);
  };

  return (
    //제목탭 - 선택한 카테고리를 출력
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">{selectedTab}</h1>

      {/* 서브제목(소개글) - components의 TabAndCategory에서 관리  */}
      <h3 className="mb-8 text-center text-xl text-[color:#67C047] underline decoration-[rgba(103,192,71,0.8)]">
        {handleTabIntroduction(selectedTab)}
      </h3>

      {/* 검색영역*/}
      <form onSubmit={handleSearchSubmit} className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full max-w-2xl justify-items-center rounded-l-full border border-gray-300 px-4 py-2"
        />
        <button type="submit" className="rounded-r-full bg-[#67C047] px-4 py-2 text-white">
          검색
        </button>
      </form>

      {/* 카테고리들-components의 TabAndCategory에서 관리 */}
      <div className="mb-8 flex justify-center space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`rounded-full px-4 py-2 hover:bg-gray-300 ${selectedTab === tab ? "border-2 border-[#67C047] bg-gray-200" : "bg-gray-200"}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/*정렬영역 - components의 TabAndCategory에서 관리*/}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-x-2">
          {sortCategory.map((sort) => (
            <button
              key={sort}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 hover:bg-gray-100"
              onClick={() => setSelectedSort(sort)}
            >
              {sort}
            </button>
          ))}
        </div>

        <button className="rounded-md border border-gray-300 bg-white px-2 py-1 text-2xl hover:bg-gray-100">
          글쓰기
        </button>
      </div>

      <PostList selectedCategory={selectedTab} searchTerm={activeSearchTerm} selectedSort={selectedSort} />
    </div>
  );
};

export default CommunityMainPage;
