"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/zustand/useAuth";


// import PostItemFilterTab from "./_components/tab/postItemFilterTab";

import Swal from 'sweetalert2';
// import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";

import PostListFilterTab from "./tab/postListFilterTab";
import MatePostList from "./post/matePostList";
import { Filters } from "../filter/page";


export type PositionData = {
  center: {
    lat: number;
    lng: number;
  };
  errMsg?: string;
  isLoading: boolean;
} | null;

const MateContent = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  // const [isCurrentPosts, setIstCurrentPosts] = useState<boolean>(true);
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState("");
  const defaultSort = "all";

  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    gender: null,
    age: null,
    date_time: undefined,
    male_female: null,
    weight: null,
    regions: null,
    times: null,
    neutered: null,
  });

  // console.log('All query params:', searchParams.toString());

  // const updateFilter = (filterName: string, value: string) => {
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [filterName]: value
  //   }));
  // };

  const handleSearchPosts = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveSearchTerm(searchTerm);
    setSearchTerm("");
  };

  // const handleToggleAllPosts = () => setIstCurrentPosts(!isCurrentPosts);
  const handleAllPosts = () => setSortBy("all");
  const handleRecruiting = () => setSortBy("recruiting");
  const handleDateSort = () => setSortBy("recruitment_end");
  const handleDistanceSort = () => setSortBy("distance");
  const handleNewSort = () => setSortBy("new");

  // const handleResetFilter = () => {
  //   setFilters({
  //     gender: null,
  //     age: null,
  //     date_time: undefined,
  //     male_female: null,
  //     weight: null,
  //     regions: null,
  //     times: null,
  //     neutered: null,
  //   });
  //   setSortBy("");
  //   setActiveSearchTerm("");
  // };

  const handleLoginCheck = () => {
    if (user) {
      router.push('/mate/posts')
    }
    if (user === null) {
      // alert("산책메이트 글쓰기를 위해서는 로그인이 필요합니다");
      Swal.fire({
        title: "로그인이 필요합니다!",
        text: "산책메이트 글쓰기를 위해서는 로그인이 필요합니다",
        icon: "warning"
      });
      router.push("/signin");
    } 
  };

  useEffect(() => {
    const newFilters = { ...filters };
    searchParams.forEach((value, key) => {
      if (key in newFilters) {
        (newFilters as Filters)[key as keyof Filters] = value;
      }
    });
    setFilters(newFilters);
  }, [searchParams]);

  return (
    <div className="w-[375px] relative mx-auto">
    {/* <div className="container  min-h-screen"> */}
      <div className="flex">
        {/* 왼쪽 메인 컨텐츠 영역 */}
        <div className="w-full">
          <div className="mt-[1rem] overflow-x-auto whitespace-nowrap scrollbar-hide ">
            <PostListFilterTab
              handleAllPosts={handleAllPosts} 
              handleRecruiting={handleRecruiting}
              handleDateSort={handleDateSort}
              handleDistanceSort={handleDistanceSort}
              handleNewSort={handleNewSort}
              sortBy={sortBy || defaultSort}
              defaultSort={defaultSort}
            />
          </div>
          <div className="m-[1.5rem]">
            <SearchBar setSearchTerm={setSearchTerm} value={searchTerm} onSubmit={handleSearchPosts} />
          </div>
          <MatePostList
            activeSearchTerm={activeSearchTerm}
            sortBy={sortBy}
            filters={filters}
          />
        </div>
        {/* 오른쪽 사이드바 영역 */}
        {/* <div className="mr-0 w-full pl-0 lg:mr-8 lg:w-1/4 lg:pl-5"> */}
          {/* 글쓰기 버튼 영역 */}
          {/* <Button onClick={handleLoginCheck} text="글쓰기" className="mb-4 flex h-12 w-full items-center justify-center rounded-lg bg-mainColor p-2" /> */}
          {/* 검색 영역 */}
          {/* <SearchBar onSubmit={handleSearchPosts} value={searchTerm} setSearchTerm={setSearchTerm}  /> */}
          {/* <PostItemFilterTab updateFilter={updateFilter} filters={filters} onClick={handleResetFilter} /> */}
        {/* </div> */}
      </div>
      <div className="fixed z-50 bottom-[6.815rem] p-[0.81rem] shadow-plusBtn rounded-full bg-mainColor cursor-pointer"   
          style={{
            right: 'calc(50% - 187.5px + 0.56rem)'
          }} 
          onClick={handleLoginCheck}>
        <img src="/assets/svg/plus-01.svg" alt="plus icon" />
      </div>
      {/* 하단 탭바 생기면 수정해 bottom, right 위치 수정 필요 */}
    </div>
  );
}

export default MateContent