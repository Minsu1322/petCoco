"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import Router from "next/router";

const MyProfile = () => {
  const params = useParams();
  if (params === null) {
    return;
  }
  const id = params.id;

  const getProfileData = async () => {
    const response = await fetch(`/api/mypage/${id}/myprofile`, {
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
      <img
        className="h-[170px] w-[170px] items-center justify-center rounded-full bg-lime-300 object-cover"
        src={user.profile_img}
        alt=""
      />
      <div className="my-auto flex flex-col items-start justify-center rounded-lg px-[15px] lg:px-0">
        <br />
        <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">닉네임: {user.nickname}</span>
        <br />
        <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">연령대: {user.age}</span>
        <br />
        <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">성별: {user.gender}</span>
        <br />
        <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">MBTI: {user.mbti}</span>
        <br />
        <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">자기소개: {user.introduction}</span>

        <div className="mt-5 flex gap-[15px]">
          <Link
            className="rounded border border-[#C9C9C9] bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
            href={`/mypage/${user.id}`}
          >
            뒤로가기
          </Link>
          <Link
            className="rounded border border-[#C9C9C9] bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
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
