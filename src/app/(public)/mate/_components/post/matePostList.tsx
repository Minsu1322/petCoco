"use client";
import MatePostItem from "./matePostItem";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { locationStore } from "@/zustand/locationStore";
import { getDistanceHaversine } from "../../getDistanceHaversine";

import { MatePostAllType, PostsResponse } from "@/types/mate.type";

export type PositionData = {
  center: {
    lat: number;
    lng: number;
  };
  errMsg?: string;
  isLoading: boolean;
} | null;

interface MatePostListProps {
  activeSearchTerm: string;
  isCurrentPosts: boolean;
  sortBy: string;
  filters: {
    gender: string | null,
    date_time: string | null,
    // position: string | null,
    male_female: string | null,
    age: string | null,
    weight: string | null,
  }
  filterBy: string;
}


const MatePostList = ({ activeSearchTerm, isCurrentPosts, sortBy, filters, filterBy }: MatePostListProps) => {
  const { setIsUseGeo, setGeoData } = locationStore();
  const [page, setPage] = useState(1);

  const { data, isPending, error } = useQuery<PostsResponse>({
    queryKey: ["matePosts", isCurrentPosts, page, activeSearchTerm, filters],
    queryFn: async () => {
      //console.log('filter값 확인', filters);
      const getValidFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== null && value !== "")
      );
      //console.log(getValidFilters);
      // const filtersString = encodeURIComponent(JSON.stringify(getValidFilters));
      let query = "";
      query = Object.keys(getValidFilters).map((key) => {
        const value = getValidFilters[key];
        return value != null ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}` : '';
      }) .join("&");

      const response = await fetch(
        `/api/mate?current=${isCurrentPosts}&page=${page}&limit=4&search=${activeSearchTerm}&${query}`
      );
      const data = response.json();
      //console.log(data);
      return data;
    }
  });

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


  const sortPosts = (posts: MatePostAllType[]) => {
    // 모집 마감 순 필터
    if (sortBy === "date") {
      return [...posts].sort((a, b) => {
        const now = new Date().getTime();
        // 오늘 날짜 기준 지난 건 맨 뒤로 가게끔 바꿔야 할 듯. 지난 것도 정렬에 포함됨

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

  const sortedPosts = sortPosts(data?.data || []);

//   const filterPosts = (posts: MatePostAllType[]) => {
//     return posts.filter(post => {
//       if (filters.gender && post.users.gender !== filters.gender) {
//         return false;
//       }

//       if(filters.age && post.users.age !== filters.age){
//         return false;
//       }
      
//       if (filters.male_female && !post.matePostPets.some(pet => pet.male_female === filters.male_female)) {
//         return false;
//       }
//       return true;
//     });
//   };

//   const sortedAndFilteredPosts = filterPosts(sortPosts(data?.data || []));
 

if(isPending) {
  return (
    <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-t-4 border-solid border-green-500"></div>
          <p className="text-lg font-semibold text-green-600">로딩 중...</p>
        </div>
      </div>
  )
}

  return (
    <div>
      <div className="ml-1 mt-5 grid grid-cols-2">
      {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => <MatePostItem key={post.id} post={post} />)
        ) : (
          <div>현재 모집 중인 산책 메이트가 없습니다.</div>
        )}
      </div>

      {/* pagination*/}
      <div className="mt-8 flex justify-center space-x-2">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className="rounded bg-mainColor px-4 py-2 text-black disabled:bg-mainColor"
        >
          이전
        </button>

        <span className="px-4 py-2">
          페이지 {page} / {data?.totalPages}
        </span>

        <button
          onClick={() => setPage((old) => (data?.totalPages && old < data.totalPages ? old + 1 : old))}
          disabled={data?.totalPages !== undefined && page === data.totalPages}
          className="rounded bg-mainColor px-4 py-2 text-black disabled:bg-mainColor"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MatePostList;
