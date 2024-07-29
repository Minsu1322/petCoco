"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const id = params.id;
  return (
    <div>
      MyPageLayout
      <Link
        className="rounded border border-[#00BBF7] bg-[#24CAFF] px-4 py-2 text-center font-bold text-white"
        href={`/mypage/${id}`}
      >
        마이페이지
      </Link>
      <Link
        className="rounded border border-[#00BBF7] bg-[#24CAFF] px-4 py-2 text-center font-bold text-white"
        href={`/mypage/${id}/myprofile`}
      >
        내 프로필
      </Link>
      <Link
        className="rounded border border-[#00BBF7] bg-[#24CAFF] px-4 py-2 text-center font-bold text-white"
        href={`/mypage/${id}/myprofile/fixmyprofile`}
      >
        프로필 변경
      </Link>
      <Link
        className="rounded border border-[#00BBF7] bg-[#24CAFF] px-4 py-2 text-center font-bold text-white"
        href={`/mypage/${id}/mypet`}
      >
        팻 프로필
      </Link>
      {children}
    </div>
  );
};

export default MyPageLayout;
