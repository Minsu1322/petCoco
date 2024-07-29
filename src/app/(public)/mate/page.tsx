"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import Link from "next/link";
import MatePostList from "./_components/post/matePostList";
import PostListFilterTab from "./_components/postListFilterTab";
import PostItemFilterTab from "./_components/postItemFilterTab";
// import SearchBar from "./_components/searchBar";
import FilterSelectChip from "./_components/filterSelectChip";
import FilterDateChip from "./_components/filterDateChip";

import { useAuthStore } from "@/zustand/useAuth";
import NotLogInView from "./_components/notLogInView";
import FilterWeightChip from "./_components/filterWeightChip";
import { age, gender, male_female, position } from "./array";
import { DateValue } from "@nextui-org/react";

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
  const [filterBy, setFilterBy] = useState("");

  const { user } = useAuthStore();

  const [filters, setFilters] = useState({
    gender: null,
    age: null,
    date_time: null,
    // position: null,
    male_female: null,
    weight: null
  });

  // const [selectedGender, setSelectedGender] = useState("");
  // const [selectedAge, setSelectedAge] = useState("");
  // const [selectedPostion, setSelectedPostion] = useState("");
  // const [selectedDate, setSelectedDate] = useState<DateValue | undefined>(undefined);
  // const [selectedMale_female, setSelectedMale_female] = useState("");
  // const [selectedWeight, setSelectedWeight] = useState("");

  const updateFilter = (filterName: string, value: string) => {
    // console.log(value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  const handleSearchPosts = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveSearchTerm(searchQuery);
  };

  const handleToggleAllPosts = () => setIstCurrentPosts(!isCurrentPosts);
  const handleDateSort = () => setSortBy("date");
  const handleDistanceSort = () => setSortBy("distance");
  
  // const handleGenderSelect = (value: string) => {
  //   updateFilter("gender", value);
  // };
  
  // const handleAgeSelect = (value: string) => {
  //   updateFilter("age", value);
  // };
  
  // const handleDistanceFilter = (value: string) => {
  //   updateFilter("position", value);
  // };

  // const handleDateFilter = (value: DateValue | undefined) => {
  //   setSelectedDate(value);
  //   // DateValue를 문자열로 변환하여 filters 상태에 저장
  //   updateFilter("date_time", value);
  // };

  // const handleMale_femaleSelect =  (value: string) => {
  //   updateFilter("male_female", value);
  // };

  // const handledWeightSelect =  (value: string) => {
  //   updateFilter("weight", value);
  // };

  // const handleResetFilter = () => {
  //   setFilters({
  //     gender: null,
  //     age: null,
  //     date_time: null,
  //     // position: null,
  //     male_female: null,
  //     weight: null
  //   });
  //   setSelectedGender("");
  //   setSelectedAge("");
  //   setFilterBy("");
  // };

  if (user === null) {
    return <NotLogInView />;
  }

  return (
    <div className="mx-8">
      <h1 className="mb-7 p-2 text-3xl">산책 메이트</h1>
      <div className="flex flex-row gap-x-5">
        {/* 왼쪽 메인 컨텐츠 영역 */}
        <div className="w-3/4">
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
            filterBy={filterBy}
          />
        </div>

        {/* 오른쪽 사이드바 영역 */}
        <div className="w-1/4 pl-5">
          <div className="mt-1 flex">
            <Link href="/mate/posts" className="mb-4 h-10 w-full items-center rounded-lg bg-mainColor p-2 text-center">
              <div>글쓰기 🐾</div>
            </Link>
          </div>
          <div className="mb-5 flex">
            <form onSubmit={handleSearchPosts} className="flex w-full flex-row items-center rounded-full border p-1">
              <input
                type="text"
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="ml-2">
                🔍
              </button>
            </form>
          </div>
          <PostItemFilterTab updateFilter={updateFilter} filters={filters} />
          {/* <PostItemFilterTab handleDistanceFilter={handleDistanceFilter}  updateFilter={updateFilter} filters={filters}  /> */}
          {/* <div className="w-full">
            <div>
              <p className="text-lg">메이트 상세 필터</p>
              <FilterSelectChip label="성별" array={gender} onSelect={handleGenderSelect} selected={selectedGender} />
              <FilterSelectChip label="연령대" array={age} onSelect={handleAgeSelect} selected={selectedAge} />
              <FilterSelectChip label="거리" array={position} selected={selectedPostion} onSelect={handleDistanceFilter} />
              {/* <FilterDateChip 
                label="산책일" 
                selectedDate={selectedDate} 
      onDateChange={handleDateFilter} 
              />   */}
            {/* </div>
            <div className="mt-5">
              <p className="text-lg">반려견 정보 필터</p>
              <FilterWeightChip label="반려견 몸무게" />
              <FilterSelectChip
              label="성별"
              array={male_female}
              selected={selectedMale_female}
              onSelect={handleMale_femaleSelect}
            />
            </div>
          </div>  */}
          <div className="mt-5 flex">
            <div
              className="mb-4 h-10 w-full cursor-pointer items-center rounded-lg bg-gray-300 p-2 text-center"
              // onClick={handleResetFilter}
            >
              초기화
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatePage;
