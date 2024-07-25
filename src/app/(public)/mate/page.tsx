"use client";

import { useQuery } from "@tanstack/react-query";

import Link from "next/link";
import MatePostList from "./_components/matePostList";
// import SearchBar from "./_components/searchBar";
import { useState, useCallback } from "react";

import { MatePostFullType } from "@/types/mate.type";
import { locationStore } from "@/zustand/locationStore";
import PostListFilterTab from "./_components/postListFilterTab";
import { getDistanceHaversine } from "./getDistanceHaversine";
import { useAuthStore } from "@/zustand/useAuth";

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
  const {user, setUser} = useAuthStore();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchData, setSearchData] = useState<MatePostFullType[]>([]);
  const [isCurrentPosts, setIstCurrentPosts] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState("");

  // 커스텀 훅으로 빼기
  const {
    data: posts,
    isPending,
    error
  } = useQuery<MatePostFullType[]>({
    queryKey: ["matePosts"],
    queryFn: async () => {
      const response = await fetch(`/api/mate`);
      const data = response.json();

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

  const sortPosts = (posts: MatePostFullType[]) => {
    if (sortBy === "date") {
      // 마감 임박순 필터
    }
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

  const handleToggleAllPosts = () => {
    setIstCurrentPosts(!isCurrentPosts);
  };
  const handleDateSort = () => setSortBy("date");
  const handleDistanceSort = () => setSortBy("distance");

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
      <h1 className="mb-5 text-center text-2xl">산책 메이트</h1>
      <div className="mx-12">
        <div className="mb-5 flex justify-center">
          <form onSubmit={handleSearchPosts} className="flex w-[300px] flex-row items-center rounded-full border p-1">
            <input
              type="text"
              className="w-[270px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="ml-2">
              🔍
            </button>
          </form>
        </div>
        <div className="flex flex-row justify-end">
          <Link href="/mate/posts" className="mb-4 h-10 w-[180px] rounded-lg bg-mainColor p-2 text-center">
            <div>글쓰기 🐾</div>
          </Link>
        </div>
        <PostListFilterTab
          isCurrentPosts={isCurrentPosts}
          handleToggleAllPosts={handleToggleAllPosts}
          handleDateSort={handleDateSort}
          handleDistanceSort={handleDistanceSort}
        />
      </div>
      {!geolocationData && sortBy === "distance" ? (
        <div className="mx-12 mt-10 text-center">위치 정보에 동의하셔야 가까운 순 필터를 사용하실 수 있습니다.</div>
      ) : (
        <MatePostList
          posts={
            searchData && searchData.length > 0 ? searchData : sortPosts(isCurrentPosts ? currentPosts : (posts ?? []))
          }
        />
      )}
    </div>
  );
};

export default MatePage;
