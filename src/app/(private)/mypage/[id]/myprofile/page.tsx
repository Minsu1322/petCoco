"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import Router from "next/router";

const MyProfile = () => {
  const params = useParams();
  const id = params.id;

  const getProfileData = async () => {
    const response = await fetch(`/api/mypage/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = response.json();

    return data;
  };

  const {
    data: user,
    isPending,
    isError
  } = useQuery({
    queryKey: ["user"],
    queryFn: getProfileData
  });
  if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (isError) {
    alert("데이터 로딩 실패");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="my-auto flex flex-col items-center justify-center px-[15px] text-[24px] sm:text-[48px] lg:px-0">
        <img className="h-[170px] w-[170px] rounded-full bg-lime-300 object-cover" src={user.profile_img} alt="" />
        <span className="text-[24px] font-bold text-[#24CAFF] sm:text-[48px]">닉네임:{user.nickname}</span>
        <span className="text-[24px] font-bold text-[#24CAFF] sm:text-[48px]">{user.age}</span>
        <span className="text-[24px] font-bold text-[#24CAFF] sm:text-[48px]">성별:{user.gender}</span>
        <span className="text-[24px] font-bold text-[#24CAFF] sm:text-[48px]">MBTI:{user.mbti}</span>
        <span className="text-[24px] font-bold text-[#24CAFF] sm:text-[48px]">자기소개:{user.introduction}</span>

        <div className="mt-5 flex gap-[15px]">
          <Link
            className="rounded border border-[#C9C9C9] bg-[#D1D1D1] px-4 py-2 text-center font-bold text-white"
            href={`/mypage/${user.id}`}
          >
            뒤로가기
          </Link>
          <Link
            className="rounded border border-[#00BBF7] bg-[#24CAFF] px-4 py-2 text-center font-bold text-white"
            href={`/mypage/${user.id}/myprofile/fixMyProfile`}
          >
            변경하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
