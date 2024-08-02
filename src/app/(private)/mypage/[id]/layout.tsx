"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  if (params === null) {
    return;
  }
  const id = params.id;
  return (
    <div className="ml-[100px] flex flex-wrap">
      <div className="gap flex flex-col items-start justify-start justify-items-start">
        <div>마이페이지</div>
        <>----------------</>
        {/* <Link className="px-4 py-2 text-center font-bold text-black" href={`/mypage/${id}`}>
          마이페이지
        </Link> */}
        <Link className="px-4 py-2 text-center font-bold text-black" href={`/mypage/${id}/myprofile`}>
          내 정보
        </Link>
        {/* <Link className="px-4 py-2 text-center font-bold text-black" href={`/mypage/${id}/myprofile/fixMyProfile`}>
          프로필 변경
        </Link>
        <Link className="px-4 py-2 text-center font-bold text-black" href={`/mypage/${id}/mypet`}>
          내 팻 관리
        </Link> */}
        <Link className="px-4 py-2 text-center font-bold text-black" href={`/mypage/${id}/myposts`}>
          내 포스트
        </Link>
        <Link className="px-4 py-2 text-center font-bold text-black" href={`/mypage/${id}/mymateposts`}>
          내 산책 메이트
        </Link>
      </div>

      <div className="w-4/5 items-center justify-center">{children}</div>
    </div>
  );
};

export default MyPageLayout;
