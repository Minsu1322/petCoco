"use client";

import { useQuery } from "@tanstack/react-query";

import Link from "next/link";
import MatePostList from "./_components/post/matePostList";
// import SearchBar from "./_components/searchBar";
import { useState, useCallback } from "react";

import { MatePostAllType } from "@/types/mate.type";
import { locationStore } from "@/zustand/locationStore";
import PostListFilterTab from "./_components/postListFilterTab";
import { getDistanceHaversine } from "./getDistanceHaversine";

export type PositionData = {
  center: {
    lat: number;
    lng: number;
  };
  errMsg?: string;
  isLoading: boolean;
} | null;

const MatePage = () => {
  const { isUseGeo, setIsUseGeo, geoData, setGeoData } = locationStore();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchData, setSearchData] = useState<MatePostAllType[]>([]);
  const [isCurrentPosts, setIstCurrentPosts] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState("");

  // 커스텀 훅으로 빼기
  const {
    data: posts,
    isPending,
    error
  } = useQuery<MatePostAllType[]>({
    queryKey: ["matePosts"],
    queryFn: async () => {
      const response = await fetch(`/api/mate`);
      const data = response.json();
      console.log(data);
      return data;
    }
  });

  const currentPosts = posts?.filter((post) => post.recruiting === true) || [];
  // const sortPosts = isCurrentPosts ? currentPosts : (posts ?? []);

  const getCurrentPosition = (): Promise<PositionData | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setIsUseGeo(false);
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            isLoading: false
          };
          setGeoData(newPosition);
          //console.log('위치 정보 획득 성공');
          setIsUseGeo(true);
          //console.log(isUseGeo);
          resolve(newPosition);
        },
        (error) => {
          //console.error('위치 정보 획득 실패:', error);
          setIsUseGeo(false);
          resolve(null);
        }
      );
    });
  };

  const {
    data: geolocationData,
    isPending: isGeoPending,
    error: geoError
  } = useQuery<PositionData, Error>({
    queryKey: ["geoData"],
    queryFn: getCurrentPosition,
    retry: false
  });
  // console.log(geolocationData?.center);
  // console.log(geoData)

  // 검색 및 필터링
  const handleSearchPosts = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const response = await fetch(`/api/mate/post?query=${searchQuery}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSearchData(data);

        return data;
      } catch (err) {
        console.error(err);
      }
    },
    [searchQuery, setSearchData]
  );

  const sortPosts = (posts: MatePostAllType[]) => {
    // 모집 마감 순 필터
    if (sortBy === "date") {
      return [...posts].sort((a, b) => {
        const now = new Date().getTime();

        const deadlineA = new Date(a.recruitment_period ?? "").getTime();
        const deadlineB = new Date(b.recruitment_period ?? "").getTime();

        // 현재 시간과 모집 마감일의 차이를 비교
        return deadlineA - now - (deadlineB - now);
      });
    }
    // 가까운 순 필터
    if (sortBy === "distance") {
      if (geolocationData) {
        return [...posts].sort((a, b) => {
          const distanceA = getDistanceHaversine({
            curPosition: geolocationData.center,
            desPosition: a.position.center
          });
          const distanceB = getDistanceHaversine({
            curPosition: geolocationData.center,
            desPosition: b.position.center
          });
          return distanceA - distanceB;
        });
      }
      return posts;
    }
    // 둘다 아닐때 원본 배열 반환
    return posts;
  };

  const handleToggleAllPosts = () => setIstCurrentPosts(!isCurrentPosts);
  const handleDateSort = () => setSortBy("date");
  const handleDistanceSort = () => setSortBy("distance");

  // const sortPostItem = () => {};

  if (isGeoPending) {
    return <div>사용자의 현재 위치를 계산하는 중입니다...</div>;
  }

  // if (geoError) {
  //   console.error(error);
  // }

  if (isPending) {
    return <div>산책 메이트 모으는 중,,,</div>;
  }

  if (error) {
    console.error(error.message);
  }
  // console.log('d',posts);

  return (
    <div className="mx-8">
      <h1 className="mb-7 text-3xl p-2">산책 메이트</h1>
      <div className="flex">
        {/* 왼쪽 메인 컨텐츠 영역 */}
        <div className="w-3/4 px-4">
          <div className="mb-5">
            <PostListFilterTab
              isCurrentPosts={isCurrentPosts}
              handleToggleAllPosts={handleToggleAllPosts}
              handleDateSort={handleDateSort}
              handleDistanceSort={handleDistanceSort}
            />
          </div>
          {!geolocationData && sortBy === "distance" ? (
            <div className="mt-10 text-center">위치 정보에 동의하셔야 가까운 순 필터를 사용하실 수 있습니다.</div>
          ) : (
            <MatePostList
              posts={
                searchData && searchData.length > 0
                  ? searchData
                  : sortPosts(isCurrentPosts ? currentPosts : (posts ?? []))
              }
            />
          )}
        </div>

        {/* 오른쪽 사이드바 영역 */}
        <div className="w-1/4 pl-4">
          <div className="mt-1 flex">
            <Link href="/mate/posts" className="mb-4 h-10 w-11/12 items-center rounded-lg bg-mainColor p-2 text-center">
              <div>글쓰기 🐾</div>
            </Link>
          </div>
          {/* <PostItemFilterTab /> */}
        </div>
      </div>
    </div>
  );
};

export default MatePage;
