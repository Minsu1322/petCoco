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
            href={`/mypage2/${user.id}/fixMyProfile`}
            className="ml-32 min-h-[23px] rounded-lg bg-[#EFEFF0] px-[10.5px] py-[3.5px] text-xs leading-relaxed tracking-wide text-neutral-400"
          >
            내 프로필 수정
          </Link>
        </div>
      </div>

      <div className="w-full border-b-1 px-[14px] py-[15px]">
        <div className="flex w-full flex-row items-center px-[12px]">
          <div className="text-lg font-bold leading-[23.4px] text-[#3e3e3e]">나의 반려동물 ({pets.length})</div>

          <Link href={`/mypage2/${user.id}/fixMyPetProfile/${pets[0].id}`}>
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
        <div className="flex w-full items-center px-[12px]">
          <div className="text-lg font-bold leading-[23.4px] text-[#3e3e3e]">나의 활동</div>
        </div>
        <div className="my-[16px] flex w-full flex-col rounded-lg bg-[#EFEFF0] px-[8px] pt-[8px]">
          <Link href={`/mypage/${id}/myposts`}>
            <div className="flex items-center justify-between border-b-1 px-[16px] py-[12px]">
              <div className="text-base font-medium text-[#61646B]">내 포스트</div>
              <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.313439 11.0201C0.135928 10.8425 0.11979 10.5648 0.265027 10.369L0.313439 10.313L4.62633 5.99984L0.313439 1.68672C0.135928 1.50921 0.11979 1.23144 0.265027 1.0357L0.313439 0.979617C0.49095 0.802106 0.768726 0.785969 0.964467 0.931205L1.02055 0.979617L5.68721 5.64628C5.86472 5.82379 5.88086 6.10157 5.73562 6.29731L5.68721 6.35339L1.02055 11.0201C0.825283 11.2153 0.508701 11.2153 0.313439 11.0201Z"
                  fill="#999999"
                />
              </svg>
            </div>
          </Link>
          <Link href={`/mypage/${id}/mymateposts`}>
            <div className="flex items-center justify-between border-b-1 px-[16px] py-[12px]">
              <div className="text-base font-medium text-[#61646B]">내 산책메이트</div>
              <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.313439 11.0201C0.135928 10.8425 0.11979 10.5648 0.265027 10.369L0.313439 10.313L4.62633 5.99984L0.313439 1.68672C0.135928 1.50921 0.11979 1.23144 0.265027 1.0357L0.313439 0.979617C0.49095 0.802106 0.768726 0.785969 0.964467 0.931205L1.02055 0.979617L5.68721 5.64628C5.86472 5.82379 5.88086 6.10157 5.73562 6.29731L5.68721 6.35339L1.02055 11.0201C0.825283 11.2153 0.508701 11.2153 0.313439 11.0201Z"
                  fill="#999999"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
