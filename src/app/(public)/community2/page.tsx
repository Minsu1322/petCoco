"use client";

import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import PostList from "./PostList";
import {
  handleTabIntroduction,
  sortCategory,
  tabs
} from "@/components/community/communityTabAndSortTab/TabAndCategory";

const CommunityMainPage = () => {
  const [selectedTab, setSelectedTab] = useState<string>("전체");
  const [selectedSort, setSelectedSort] = useState<string>("최신순");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>("");
  const [showMoreKeywords, setShowMoreKeywords] = useState<boolean>(false);

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(searchTerm);
    setActiveSearchTerm(searchTerm);
  };

  return (
    <>
      <div className="mx-auto h-full w-[375px] border px-[1.5rem]">
        <h2 className="mb-[1rem] mt-[2rem] text-[2rem] font-semibold">커뮤니티</h2>
        <div className="mb-[1rem] text-[1rem]">
          여러분의 소중한 반려동물 이야기를 <br />
          자유롭게 들려주세요
        </div>
        <SearchBar onSubmit={handleSearchSubmit} value={searchTerm} setSearchTerm={setSearchTerm} />
        {/* 최근 핫 키워드 */}
        <div className="">
          <div className="py-[0.62rem] flex w-full gap-[0.62rem]">
            {tabs.slice(0, showMoreKeywords ? undefined : 9).map((keyword, index) => (
              <button
                key={keyword}
                className={`border px-[0.62rem] py-[0.38rem] text-[0.9rem] rounded-full  ${
                  selectedTab === keyword
                    ? "bg-mainColor text-white"
                    // : index === 8 && !showMoreKeywords
                    //   ? "border border-mainColor text-mainColor"
                      : "border border-mainColor text-mainColor"
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
        <PostList selectedCategory={selectedTab} searchTerm={activeSearchTerm} selectedSort={selectedSort} />
      </div>
    </>
  );
};

export default CommunityMainPage;
