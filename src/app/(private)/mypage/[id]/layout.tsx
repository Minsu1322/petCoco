"use client";

import { useAuthStore } from "@/zustand/useAuth";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import NavLink from "../navLink";

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore((state) => ({
    user: state.user
  }));
  const id = params.id;

  if (params === null) {
    return null;
  }

  const handleMypageClick = () => {
    if (user) {
      router.push(`/mypage/${user.id}/myprofile`);
    } else {
      router.push("/signin");
    }
  };

  return (
    <div className="flex w-full justify-center sm:mt-[50px]">
      <div className="flex w-full justify-center">
        <div className="flex hidden justify-end sm:block">
          <div className="ml-5 mr-[50px] mt-[20px] flex h-[300px] w-[200px] flex-col rounded-md border border-mainColor">
            <div className="mt-5 flex w-full flex-col">
              <button onClick={handleMypageClick} className="mt-5 text-[22px] font-semibold">
                마이페이지
              </button>
            </div>
            <div className="mt-5 flex w-full flex-col items-center">
              <div className="flex w-full flex-col items-center">
                <NavLink href={`/mypage/${id}/myprofile`}>내 정보</NavLink>
                <NavLink href={`/mypage/${id}/myposts`}>내 포스트</NavLink>
                <NavLink href={`/mypage/${id}/mymateposts`}>내 산책 메이트</NavLink>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="itmes-center mt-[20px] flex justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default MyPageLayout;
