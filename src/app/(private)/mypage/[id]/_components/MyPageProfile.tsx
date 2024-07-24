"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const MyPageProfile = () => {
  const params = useParams();
  const id = params.id;
  const getProfileData = async () => {
    const response = await fetch("/api/mypage", {
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

  console.log(user);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="my-auto flex flex-col items-center justify-center px-[15px] text-[24px] sm:text-[48px] lg:px-0">
        <img className="h-[170px] w-[170px] rounded-full bg-lime-300 object-cover" src={user.profile_img} alt="" />
        <span className="text-[24px] font-bold text-[#24CAFF] sm:text-[48px]">{user.nickname}</span>님 반갑습니다.
      </div>
    </div>
  );
};

export default MyPageProfile;
