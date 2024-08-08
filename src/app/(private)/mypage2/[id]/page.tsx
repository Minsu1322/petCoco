"use client";

import { UsersPetType } from "@/types/auth.type";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { defaultUserImg, defaultPetImg } from "@/components/DefaultImg";
import NavLink from "../../mypage/navLink";

type PetType = UsersPetType;

function MyPage() {
  const params = useParams();

  const id = params?.id || 0;
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
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full gap-4 whitespace-nowrap border-b-1 px-[24px] py-[34px] text-lg leading-tight text-neutral-800">
        <img className="aspect-square w-11 shrink-0 rounded" src={user.profile_img || defaultUserImg} alt="" />
        <div className="my-auto w-[52px] self-stretch font-semibold">{user.nickname}</div>
        <div>
          <Link
            href={`/mypage/${user.id}/myprofile/fixMyProfile`}
            className="ml-32 min-h-[23px] rounded-lg bg-[#EFEFF0] px-[10.5px] py-[3.5px] text-xs leading-relaxed tracking-wide text-neutral-400"
          >
            내 프로필 수정
          </Link>
        </div>
      </div>

      <div className="w-full border-b-1 px-[14px] py-[15px]">
        <div className="flex w-full flex-row items-center px-[12px]">
          <div className="text-lg font-bold leading-[23.4px] text-[#3e3e3e]">나의 댕댕이 ({pets.length})</div>

          <Link href={`/mypage/${user.id}/myprofile/fixMyProfile`}>
            <button className="ml-2 rounded-lg bg-[#EFEFF0] px-[5.5px] py-[3.5px] text-[10px] leading-[16px] tracking-wide text-neutral-400">
              반려동물 프로필 수정
            </button>
          </Link>
        </div>
        <div className="mt-[13px] flex w-full flex-col rounded-[10px] bg-[#EFEFF0]">
          {pets?.map(
            (pet, i) =>
              i === 0 && (
                <Link key={pet.id} href={`/mypage/${id}/mypet/mypetprofile/${pet.id}`}>
                  <div className="ml-2 mt-2 flex flex-row rounded-xl bg-[#EFEFF0]">
                    <img
                      className="h-[100px] w-[100px] rounded bg-lime-300 object-cover"
                      src={pet.petImage ? pet.petImage : defaultPetImg}
                      alt="..."
                    />
                    <div className="ml-4 flex flex-col">
                      <div className="font-semibold leading-normal">
                        <span className="text-lg">{pet.petName}</span>
                        <span>
                          ({pet.minorClass},{pet.age}살)
                        </span>
                      </div>
                      <div className="inline-flex h-5 items-start justify-start gap-2">
                        <div className="text-base font-normal leading-tight text-[#939396]">성별</div>
                        <div className="shrink grow basis-0 truncate text-base font-normal leading-tight text-[#444447]">
                          {pet.male_female}
                          <span className="text-sm">(중성화 여부:{pet.neutralized})</span>
                        </div>
                      </div>
                      <div className="inline-flex h-5 items-start justify-start gap-2">
                        <div className="text-base font-normal leading-tight text-[#939396]">의료기록</div>
                        <div className="shrink grow basis-0 truncate text-base font-normal leading-tight text-[#444447]">
                          {pet.medicalRecords}
                        </div>
                      </div>
                      <div className="inline-flex h-5 items-start justify-start gap-2">
                        <div className="text-base font-normal leading-tight text-[#939396]">메모</div>
                        <div className="shrink grow basis-0 truncate text-base font-normal leading-tight text-[#444447]">
                          {pet.introduction}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
          )}
        </div>
      </div>
      <div className="w-full px-[14px] py-[16px]">
        <div className="flex w-full flex-row items-center px-[12px]">
          <div className="text-lg font-bold leading-[23.4px] text-[#3e3e3e]">나의 활동</div>
        </div>
        <div className="my-[16px] flex w-full flex-col rounded-lg bg-[#EFEFF0]">
          <div className="flex w-full flex-col px-[8px] py-[8px]">
            <Link href={`/mypage/${id}/myposts`}>
              <div className="border-b-1 px-[16px] py-[8px] text-base">내 포스트</div>
            </Link>
            <Link href={`/mypage/${id}/mymateposts`}>
              <div className="border-b-1 px-[16px] py-[8px] text-base">내 산책 메이트</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
