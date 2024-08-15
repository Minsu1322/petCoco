"use client";
import MatePostItem from "./matePostItem";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { locationStore } from "@/zustand/locationStore";
import { getDistanceHaversine } from "../../getDistanceHaversine";

import { MatePostAllTypeForItem, PostsResponse } from "@/types/mate.type";

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
  // isCurrentPosts: boolean;
  sortBy: string;
  filters: {
    gender: string | null;
    date_time: string | undefined;
    male_female: string | null;
    age: string | null;
    weight: string | null;
    regions: string | null;
    times: string | null;
    neutered: string | null;
  };
}

const MatePostList = ({ activeSearchTerm, sortBy, filters }: MatePostListProps) => {
  const { geoData, setIsUseGeo, setGeoData } = locationStore();
  const [page, setPage] = useState(1);
  //console.log(geoData)

  const getCurrentPosition = (): Promise<PositionData | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        // console.error('위치 정보 사용 거부:', error);
        const defaultPosition = {
          center: { lat: 37.5556236021213, lng: 126.992199507869 },
          errMsg: "Geolocation is not supported",
          isLoading: false
        };
        setIsUseGeo(false);
        setGeoData(defaultPosition);
        resolve(defaultPosition);
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
          // console.log('위치 정보 획득 성공');
          setIsUseGeo(true);
          resolve(newPosition);
        },
        (error) => {
          // console.error('위치 정보 획득 실패:', error);
          const defaultPosition = {
            center: { lat: 37.5556236021213, lng: 126.992199507869 },
            errMsg: error.message,
            isLoading: false
          };
          setIsUseGeo(false);
          setGeoData(defaultPosition);
          resolve(defaultPosition);
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
    retry: false,
  });

  const { data, isPending, error } = useQuery<PostsResponse>({
    queryKey: ["matePosts", page, activeSearchTerm, sortBy, filters, geoData],
    queryFn: async () => {
      //console.log('sortBy값 확인', sortBy);
      const getValidFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== null && value !== "" && value !== undefined)
      );

      let query = "";
      query = Object.keys(getValidFilters)
        .map((key) => {
          const value = getValidFilters[key];
          return value != null ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}` : "";
        })
        .join("&");

      const userLat = geoData?.center.lat || 0;
      const userLng = geoData?.center.lng || 0;

      const defaultSortBy = sortBy && sortBy !== 'all' ? sortBy : 'all';
      // TODO: query안에 userLat, userLng 넣기
      const response = await fetch(
        `/api/mate?page=${page}&limit=4&search=${activeSearchTerm}&sort=${defaultSortBy}&${query}&userLat=${userLat}&userLng=${userLng}`
      );
      const data = response.json();
      return data;
    },
    enabled: !!geolocationData
  });

  const posts = data?.data ?? [];

  if (isPending) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex flex-col items-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-t-4 border-solid border-mainColor"></div>
          <p className="text-lg font-semibold text-mainColor">로딩 중...</p>
        </div>
      </div>
    );
  }

  if(isGeoPending) {
    return (
    <div className="flex items-center justify-center w-full h-screen">
    <div className="flex flex-col items-center">
      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-t-4 border-solid border-mainColor"></div>
      <p className="text-lg font-semibold text-mainColor">사용자의 위치를 계산하는 중입니다...</p>
    </div>
  </div>)
  }

  return (
    <div className="w-full flex flex-col justify-center items-center mb-[100px]">
        <div className="flex flex-col mx-[1.5rem] gap-y-[1.5rem]">
          {posts.length > 0 ? (
            posts.map((post) => <MatePostItem key={post.id} post={post} />)
          ) : (
            <div className="flex items-center justify-center w-full h-screen">
              <div className="flex flex-col items-center">
                <span className="mr-2 text-3xl">🐶</span>
                <p className="py-4 text-center">현재 모집 중인 산책 메이트가 없습니다.</p>
              </div>
            </div>
          )}
        </div>

      {/* pagination */}
      <div className="flex flex-row items-center justify-center mt-[1.5rem]">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className="rounded bg-[#c5b1f7] px-4 py-2 text-black disabled:bg-opacity-50"
        >
          이전
        </button>
        <span className="px-4 py-2">
          페이지 {!data || data.data?.length === 0 ? "0" : `${page}`} / {data?.totalPages ?? "0"}
        </span>
        <button
          onClick={() => setPage((old) => (data?.totalPages && old < data.totalPages ? old + 1 : old))}
          disabled={data?.totalPages !== undefined && page === data.totalPages}
          className="rounded bg-[#c5b1f7] px-4 py-2 text-black disabled:bg-opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MatePostList;
