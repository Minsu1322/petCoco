"use client";

import { useAuthStore } from "@/zustand/useAuth";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { UsersPetType } from "@/types/auth.type";

type PetType = UsersPetType;

function MyPage() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id || 0;

  const user = useAuthStore((state) => state.user);
  useEffect(() => {}, [user]);

  const getProfileData = async () => {
    const response = await fetch(`/api/mypage/${id}/myprofile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = response.json();

    return data;
  };

  const {
    data: userProfile,
    isPending,
    isError
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getProfileData
  });

  const getPetData = async () => {
    const response = await fetch(`/api/mypage/${id}/mypetprofile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = response.json();

    return data;
  };

  const {
    data: pets,
    isPending: isPetPending,
    isError: isPetError
  } = useQuery<PetType[]>({
    queryKey: ["pets", id],
    queryFn: getPetData
  });

  if (isPending || isPetPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (isError || isPetError) {
    return <div className="flex h-screen items-center justify-center">데이터 로딩 실패</div>;
  }

  if (user === null) {
    alert("로그인되어야 마이페이지를 확인 할 수 있습니다.");
    router.push("/signin");
  } else {
    return (
      <div className="pb-[200px] pt-[70px]">
        <div className="flex flex-col items-center justify-center">
          <div className="my-auto flex flex-col items-center justify-center px-[15px] text-[24px] sm:text-[48px] lg:px-0">
            <img
              className="h-[170px] w-[170px] rounded-full bg-lime-300 object-cover"
              src={userProfile.profile_img}
              alt=""
            />
            <span className="font-bold text-[#42E68A] sm:text-[48px]">
              {userProfile.nickname}
              <div className="text-[36px] text-black">님 반갑습니다.</div>
            </span>

            <Link
              className="rounded border bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
              href={`/mypage/${userProfile.id}/myprofile`}
            >
              내 프로필
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          {pets?.map((pet) => (
            <Link key={pet.id} href={`/mypage/${id}/mypet/mypetprofile/${pet.id}`}>
              <div className="my-auto flex flex-col items-center justify-center px-[15px] lg:px-0">
                <img
                  className="h-[170px] w-[170px] rounded-full bg-lime-300 object-cover"
                  src={pet.petImage || "..."}
                  alt="..."
                />
                <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">이름:{pet.petName}</span>
                <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">{pet.majorClass}</span>
                <span className="text-[24px] font-bold text-[#000000] sm:text-[20px]">{pet.minorClass}</span>
              </div>
            </Link>
          ))}
          <div className="mt-5 flex gap-[15px]">
            <Link
              className="rounded border border-[#C9C9C9] bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
              href={`/mypage/${id}/mypet`}
            >
              내 애완동물
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default MyPage;
