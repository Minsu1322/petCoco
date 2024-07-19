"use client";
import PostList from "@/components/community/PostList";
import React, { useState } from "react";

const CommunityMainPage = () => {
  const tabs = ["전체", "인기글", "자유게시판", "고양이", "강아지", "희귀동물", "자랑하기", "고민있어요"];
  const [selectedTab, setSelectedTab] = useState<string>("전체");

  const handleCategorySelect = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">제목영역</h1>
      <h3 className="mb-8 text-center text-xl text-[color:#67C047] underline decoration-[rgba(103,192,71,0.8)]">
        커뮤니티 한줄소개글
      </h3>
      <div className="mb-8">
        <input
          type="text"
          placeholder="검색..."
          className="mx-auto block w-full max-w-2xl rounded-full border border-gray-300 px-4 py-2"
        />
      </div>

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

      <div className="mb-8 flex items-center justify-between">
        <div className="space-x-2">
          {["최신순", "인기순", "댓글많은순"].map((sort) => (
            <button key={sort} className="rounded-md border border-gray-300 bg-white px-2 py-1 hover:bg-gray-100">
              {sort}
            </button>
          ))}
        </div>

        <button className="rounded-md border border-gray-300 bg-white px-2 py-1 text-2xl hover:bg-gray-100">
          글쓰기
        </button>
      </div>

      <PostList selectedCategory={selectedTab} />
    </div>
  );
};

export default CommunityMainPage;
