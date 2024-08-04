"use client";

import { useAuthStore } from "@/zustand/useAuth";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";

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
    <div className="mt-[50px] flex w-full justify-center">
      <div className="flex w-full justify-center">
        <div className="flex justify-end">
          <div className="ml-5 mr-[50px] mt-[20px] flex h-[300px] w-[200px] flex-col rounded-md border border-mainColor">
            <div className="mt-5 flex w-full flex-col">
              <button onClick={handleMypageClick} className="mt-5 text-[22px] font-semibold">
                마이페이지
              </button>
              {/* <div className="flex w-full justify-center">
            <div className="w-[90%] border border-mainColor"></div>
          </div> */}
            </div>
            <div className="mt-5 flex w-full flex-col items-center">
              <div className="flex w-full flex-col items-center">
                <Link
                  className="flex h-[50px] w-[90%] items-center rounded-md px-6 hover:bg-mainColor"
                  href={`/mypage/${id}/myprofile`}
                >
                  내 정보
                </Link>
                <Link
                  className="flex h-[50px] w-[90%] items-center rounded-md px-6 hover:bg-mainColor"
                  href={`/mypage/${id}/myposts`}
                >
                  내 포스트
                </Link>
                <Link
                  className="flex h-[50px] w-[90%] items-center rounded-md px-6 hover:bg-mainColor"
                  href={`/mypage/${id}/mymateposts`}
                >
                  내 산책 메이트
                </Link>
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
