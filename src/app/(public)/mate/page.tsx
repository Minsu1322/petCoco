"use client";

import { useQuery } from "@tanstack/react-query";

import Link from "next/link";
import MatePostList from "./_components/matePostList";
import SearchBar from "./_components/searchBar";
import { useState } from "react";

import { MatePostFullType } from "@/types/mate.type";
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
};

const MatePage = () => {
  const { position, setPosition, geoData, setGeoData } = locationStore();
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

  const getCurrentPosition = (): Promise<PositionData> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
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
            resolve(newPosition);
          },
          (error) => {
            const defaultPosition = {
              center: { lat: 37.5556236021213, lng: 126.992199507869 },
              errMsg: error.message,
              isLoading: false
            };
            setGeoData(defaultPosition);
            reject(error);
          }
        );
      } 
      if(!navigator.geolocation) {
        const noGeoPosition = {
          center: { lat: 37.5556236021213, lng: 126.992199507869 },
          errMsg: "Geolocation is not supported by this browser.",
          isLoading: false
        };
        setGeoData(noGeoPosition);
        reject(new Error("Geolocation is not supported by this browser."));
      }
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
        <SearchBar />
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
        <div className="mx-12 mt-10 text-center">
          위치 정보에 동의하셔야 가까운 순 필터를 사용하실 수 있습니다.
        </div>
      ) : (
        <MatePostList
          posts={sortPosts(isCurrentPosts ? currentPosts : (posts ?? []))}
        />
      )}
    </div>
  );
};

export default MatePage;
