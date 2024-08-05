"use client";

import { UsersPetType } from "@/types/auth.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PetType = UsersPetType;

const MyPetProfile = () => {
  const [filteredProfile, setFilteredProfile] = useState<PetType[]>([]);
  const queryClient = useQueryClient();
  const params = useParams();
  const router = useRouter();

  const id = params?.id || 0;
  const petId = params?.petId || 0;

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

  useEffect(() => {
    if (!pet) {
      return;
    }
    const filtered = pet.filter((profile) => {
      return profile.id === petId;
    });
    setFilteredProfile(filtered);
  }, [pet]);

  function toMyPet() {
    router.push(`/mypage/${id}/myprofile`);
  }

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
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        deleteMutation(id);
      } catch (error) {
        console.log("삭제에 실패했습니다.", error);
      }
      alert("삭제가 완료되었습니다.");

      toMyPet();
    } else {
      return;
    }
  };
  if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (isError) {
    return <div className="flex h-screen items-center justify-center">데이터 로딩 실패</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <img
        className="h-[170px] w-[170px] items-center justify-center rounded-full bg-lime-300 object-cover"
        src={filteredProfile[0]?.petImage || "..."}
        alt=""
      />
      <div className="flex flex-row gap-4">
        <div className="my-auto flex h-[400px] w-[400px] flex-col items-center gap-2 rounded-lg bg-[#e9f0ff] p-4">
          <div className="mb-[40px] flex w-full flex-col items-center">
            <span className="text-[24px] font-semibold">기본 정보</span>
            <div className="mt-2 w-[95%] border border-gray-400"></div>
          </div>
          <div className="h-full w-[350px]">
            <div className="flex w-full justify-between">
              <span className="flex flex-col items-center text-[20px]">
                <p className="font-semibold">이름</p>
                {filteredProfile[0]?.petName}
              </span>

              <span className="flex flex-col items-center text-[20px]">
                <p className="font-semibold">대분류</p>
                {filteredProfile[0]?.majorClass}
              </span>

              <span className="flex flex-col items-center text-[20px]">
                <p className="font-semibold">소분류</p>
                {filteredProfile[0]?.minorClass}
              </span>
            </div>
            <div className="mt-[50px] flex justify-between">
              <span className="flex flex-col items-center text-[20px]">
                <p className="font-semibold">나이</p>
                {filteredProfile[0]?.age}
              </span>

              <span className="flex flex-col items-center text-[20px]">
                <p className="font-semibold">성별</p>
                {filteredProfile[0]?.male_female}
              </span>

              <span className="flex flex-col items-center text-[20px]">
                <p className="font-semibold">중성화 여부</p> {filteredProfile[0]?.neutralized}
              </span>

              <span className="flex flex-col items-center text-[20px]">
                <p className="font-semibold">무게</p>
                {filteredProfile[0]?.weight} kg
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="flex h-[400px] w-[400px] flex-col items-center break-words rounded-lg bg-[#e9f0ff] p-4">
            <div className="mb-[40px] flex w-full flex-col items-center">
              <span className="text-[24px] font-semibold">의료기록</span>
              <div className="mt-2 w-[95%] border border-gray-400"></div>
            </div>
            <div className="h-full w-[350px]">
              <span className="text-[20px]">{filteredProfile[0]?.medicalRecords}</span>
            </div>
          </div>
        </div>
        <div>
          <div className="flex h-[400px] w-[400px] flex-col items-center break-words rounded-lg bg-[#e9f0ff] p-4">
            <div className="mb-[40px] flex w-full flex-col items-center">
              <span className="text-[24px] font-semibold">자기소개</span>
              <div className="mt-2 w-[95%] border border-gray-400"></div>
            </div>
            <div className="h-full w-[350px]">
              <span className="text-[20px]">{filteredProfile[0]?.introduction}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-10 mt-5 flex gap-[30px]">
        <Link
          href={`/mypage/${id}/myprofile`}
          className="rounded border border-[#C9C9C9] bg-mainColor px-4 py-2 text-center text-[16px] font-semibold text-black"
        >
          뒤로가기
        </Link>
        <Link
          href={`/mypage/${id}/mypet/fixmypetprofile/${filteredProfile[0]?.id}`}
          className="rounded border border-[#C9C9C9] bg-mainColor px-4 py-2 text-center text-[16px] font-semibold text-black"
        >
          변경하기
        </Link>
        <button
          className="rounded border border-[#C9C9C9] bg-mainColor px-4 py-2 text-center text-[16px] font-semibold text-black"
          onClick={() => handleDelte(filteredProfile[0]?.id)}
        >
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default MyPetProfile;
