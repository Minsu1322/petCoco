"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const id = params.id;
  return (
    <div className="ml-[100px] flex flex-wrap">
      <div className="gap flex flex-col items-start justify-start justify-items-start">
        <div>마이페이지</div>
        <>----------------</>
        <Link className="px-4 py-2 text-center font-bold text-black" href={`/mypage/${id}`}>
          마이페이지
        </Link>
        <Link className="px-4 py-2 text-center font-bold text-black" href={`/mypage/${id}/myprofile`}>
          내 프로필
        </Link>
        <Link className="px-4 py-2 text-center font-bold text-black" href={`/mypage/${id}/myprofile/fixMyProfile`}>
          프로필 변경
        </Link>
        <Link className="px-4 py-2 text-center font-bold text-black" href={`/mypage/${id}/mypet`}>
          팻 프로필
        </Link>
      </div>

      <div className="w-4/5 items-center justify-center">{children}</div>
    </div>
  );
};

export default MyPageLayout;
