'use client';

import { MatePostFullType } from "@/types/mate.type";
import { useState } from "react";

interface PostListFilterTabProps {
  isCurrentPosts: boolean;
  handleToggleAllPosts: () => void;
  handleDateSort: () => void;
  handleDistanceSort: () => void;
}

const PostListFilterTab = ({isCurrentPosts, handleToggleAllPosts, handleDateSort, handleDistanceSort}: PostListFilterTabProps) => {

  return (
    <div>
      <div className="mb-3 flex flex-row justify-between">
        <div className="cursor-pointer" onClick={handleToggleAllPosts}>
          {isCurrentPosts ? "모집 완료된 메이트도 보기" : "모집 중인 메이트만 보기"}
        </div>
        <div className="flex flex-row gap-x-2">
          <div className="cursor-pointer" onClick={handleDateSort}>마감 임박순</div>
          <p>|</p>
          <div className="cursor-pointer" onClick={handleDistanceSort}>가까운 순</div>
        </div>
      </div>
    </div>
  );
};

export default PostListFilterTab;
