"use client";

import { UsersPetType } from "@/types/auth.type";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import Router from "next/router";

const MyPetProfile = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  if (params === null) {
    return;
  }
  const id = params.id;
  const petId = params.petId;

  const getProfileData = async () => {
    const response = await fetch(`/api/mypage/${id}/mypetprofile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = response.json();

    return data;
  };
  const {
    data: pet,
    isPending,
    isError
  } = useQuery<UsersPetType[]>({
    queryKey: ["pet"],
    queryFn: getProfileData
  });

  const deleteProfile = async (id: string) => {
    const response = await fetch(`/api/mypage/${id}/mypetprofile`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(id)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const { mutate: deleteMutation } = useMutation<UsersPetType, Error, string>({
    mutationFn: (id) => deleteProfile(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pet"] })
  });

  const handleDelte = async (id: string) => {
    try {
      deleteMutation(id);
    } catch (error) {
      console.log("삭제에 실패했습니다.", error);
    }
    alert("삭제가 완료되었습니다.");
  };

  if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (isError) {
    alert("데이터 로딩 실패");
    return null;
  }

  const filteredProfile = pet.filter((profile) => {
    return profile.id === petId;
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <img
        className="h-[170px] w-[170px] items-center justify-center rounded-full bg-lime-300 object-cover"
        src={filteredProfile[0].petImage || "..."}
        alt=""
      />
      <div className="my-auto flex flex-col items-start justify-center rounded-lg px-[15px] lg:px-0">
        <br />
        <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">이름: {filteredProfile[0].petName}</span>
        <br />
        <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">
          대분류: {filteredProfile[0].majorClass}
        </span>
        <br />
        <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">
          소분류: {filteredProfile[0].minorClass}
        </span>
        <br />
        <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">나이: {filteredProfile[0].age}</span>
        <br />
        <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">
          성별: {filteredProfile[0].male_female}
        </span>
        <br />
        <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">
          중성화 여부: {filteredProfile[0].neutralized}
        </span>
        <br />
        <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">
          의료기록: {filteredProfile[0].medicalRecords}
        </span>
        <br />
        <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">
          자기소개: {filteredProfile[0].introduction}
        </span>
      </div>
      <div className="mt-5 flex gap-[15px]">
        <Link
          href={`/mypage/${id}/mypet`}
          className="rounded border border-[#C9C9C9] bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
        >
          뒤로가기
        </Link>
        <Link
          href={`/mypage/${id}/mypet/fixmypetprofile/${filteredProfile[0].id}`}
          className="rounded border border-[#C9C9C9] bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
        >
          변경하기
        </Link>
        <button
          className="rounded border border-[#C9C9C9] bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
          onClick={() => handleDelte(filteredProfile[0].id)}
        >
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default MyPetProfile;
