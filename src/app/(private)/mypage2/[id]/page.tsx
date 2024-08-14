"use client";

import { UsersPetType } from "@/types/auth.type";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { defaultUserImg, defaultPetImg } from "@/components/DefaultImg";
import { EmblaOptionsType } from "embla-carousel";
import MyPetCarousel from "./../MyPetCarousel/MyPetCarousel";
import Image from "next/image";

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

  const OPTIONS: EmblaOptionsType = { align: "center", dragFree: true, loop: true, startIndex: 2 };
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full justify-between whitespace-nowrap border-y-1 px-[24px] py-[34px] text-lg leading-tight text-neutral-800">
        <div className="flex gap-6">
          <Image
            className="aspect-square h-[60px] w-[60px] shrink-0 rounded-full object-cover"
            width={60}
            height={60}
            src={user.profile_img || defaultUserImg}
            alt=""
          />
          <div className="my-auto w-[52px] self-stretch text-[18px] font-semibold leading-[23.4px]">
            {user.nickname}
          </div>
        </div>
        <Link href={`/mypage2/${user.id}/fixMyProfile`}>
          <div className="mb-[13px] mt-[15px] rounded-lg bg-[#8E6EE8] px-4 py-[6px] text-xs font-semibold leading-relaxed tracking-wide text-[#FFFFFF]">
            내 프로필 수정
          </div>
        </Link>
      </div>

      <div className="w-full border-b-1 px-[14px] py-[15px]">
        <div className="flex w-full flex-row items-center justify-between px-[12px]">
          <div className="text-lg font-bold leading-[23.4px] text-[#3e3e3e]">나의 반려동물 ({pets?.length})</div>
          {pets && pets.length ? (
            <Link href={`/mypage2/${user.id}/fixMyPetProfile/${pets[0]?.id}`}>
              <button className="ml-2 rounded-lg bg-[#8E6EE8] px-4 py-[6px] text-sm font-semibold tracking-wide text-[#FFFFFF]">
                반려동물 프로필 수정
              </button>
            </Link>
          ) : (
            <Link href={`/mypage2/${user.id}/addMyPetProfile`}>
              <button className="ml-2 rounded-lg bg-[#8E6EE8] px-4 py-[6px] text-sm font-semibold tracking-wide text-[#FFFFFF]">
                반려동물 프로필 추가
              </button>
            </Link>
          )}
        </div>

        {/* 여기부터 */}
        {/* <div className="mt-3 flex w-full flex-col rounded-[10px] bg-[#EFEFF0] p-3">
          {pets?.map(
            (pet, i) =>
              i === 0 && (
                <Link key={pet.id} href={`/mypage2/${id}/fixMyPetProfile/${pet.id}`}>
                  <div className="flex gap-[10px]">
                    <div className="my-2 px-5">
                      <img
                        className="h-[60px] w-[60px] rounded-full bg-lime-300 object-cover"
                        src={pet.petImage ? pet.petImage : defaultPetImg}
                        alt="..."
                      />
                    </div>
                    <div className="pl-2">
                      <div>
                        <span className="text-lg font-normal">{pet.petName} </span>
                        <span className="text-sm font-normal">({pet.male_female})</span>
                      </div>
                      <div>
                        <span className="text-base font-normal text-[#939396]">몸무게 </span>
                        <span className="text-base font-normal">{pet.weight}kg</span>
                      </div>
                      <div>
                        <span className="text-base font-normal text-[#939396]">중성화 여부 </span>
                        <span className="text-base font-normal">{pet.neutralized}</span>
                      </div>
                      <div>
                        <span className="text-base font-normal text-[#939396]">성향 </span>
                        <span className="text-base font-normal">{pet.introduction}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
          )}
        </div> */}
        {/* 여기까지 */}
        <div className="w-full">
          <MyPetCarousel slides={SLIDES} options={OPTIONS} />
        </div>
      </div>
      <div className="w-full px-[14px] py-[16px]">
        <div className="flex w-full items-center px-[12px]">
          <div className="text-lg font-bold leading-[23.4px] text-[#3e3e3e]">나의 활동</div>
        </div>
        <div className="my-[16px] flex w-full flex-col rounded-lg bg-[#EFEFF0] px-[8px] pt-[8px]">
          <Link href={`/mypage2/${id}/myPosts`}>
            <div className="flex items-center justify-between border-b-1 px-[16px] py-[12px]">
              <div className="text-base font-medium text-[#61646B]">내 포스트</div>
              {/* <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.313439 11.0201C0.135928 10.8425 0.11979 10.5648 0.265027 10.369L0.313439 10.313L4.62633 5.99984L0.313439 1.68672C0.135928 1.50921 0.11979 1.23144 0.265027 1.0357L0.313439 0.979617C0.49095 0.802106 0.768726 0.785969 0.964467 0.931205L1.02055 0.979617L5.68721 5.64628C5.86472 5.82379 5.88086 6.10157 5.73562 6.29731L5.68721 6.35339L1.02055 11.0201C0.825283 11.2153 0.508701 11.2153 0.313439 11.0201Z"
                  fill="#999999"
                />
              </svg> */}
            </div>
          </Link>
          <Link href={`/mypage2/${id}/myMatePosts`}>
            <div className="flex items-center justify-between border-b-1 px-[16px] py-[12px]">
              <div className="text-base font-medium text-[#61646B]">내 산책메이트</div>
              {/* <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.313439 11.0201C0.135928 10.8425 0.11979 10.5648 0.265027 10.369L0.313439 10.313L4.62633 5.99984L0.313439 1.68672C0.135928 1.50921 0.11979 1.23144 0.265027 1.0357L0.313439 0.979617C0.49095 0.802106 0.768726 0.785969 0.964467 0.931205L1.02055 0.979617L5.68721 5.64628C5.86472 5.82379 5.88086 6.10157 5.73562 6.29731L5.68721 6.35339L1.02055 11.0201C0.825283 11.2153 0.508701 11.2153 0.313439 11.0201Z"
                  fill="#999999"
                />
              </svg> */}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
