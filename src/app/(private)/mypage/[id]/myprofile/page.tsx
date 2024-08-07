"use client";

import { UsersPetType } from "@/types/auth.type";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { defaultUserImg, defaultPetImg } from "@/components/DefaultImg";
import NavLink from "../../navLink";

type PetType = UsersPetType;

const MyProfile = () => {
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
    <div className="">
      <div className="ml-4 flex flex-col items-center gap-2 sm:flex-row">
        <div className="h-px w-full border-[#DEE5ED] bg-[#DEE5ED] opacity-60" />
        <div className="flex w-full gap-4 whitespace-nowrap text-lg leading-tight text-neutral-800">
          <img className="aspect-square w-11 shrink-0 rounded" src={user.profile_img || defaultUserImg} alt="" />
          <div className="flex flex-col">
            <span className="my-auto w-[52px] self-stretch font-semibold">
              {user.nickname}
              <Link
                href={`/mypage/${user.id}/myprofile/fixMyProfile`}
                className="mb-10 ml-20 min-h-[23px] overflow-hidden rounded-lg bg-[#EFEFF0] bg-zinc-100 px-1 py-1 text-xs leading-relaxed tracking-wide text-neutral-400"
              >
                내 프로필 수정
              </Link>
              <div className="ml-2 hidden text-[30px] text-black sm:block">님 반갑습니다.</div>
            </span>
          </div>

          <div className="flex hidden justify-center sm:block">
            <div className="flex w-[90%] flex-col rounded-lg">
              <div className="mb-5 flex w-[50%] justify-between">
                <span className="flex flex-col items-center gap-1">
                  <p className="text-[20px] font-semibold">연령대</p>
                  <p className="text-[18px]">{user.age}</p>
                </span>
                <span className="flex flex-col items-center gap-1">
                  <p className="text-[20px] font-semibold">성별</p>
                  <p className="text-[18px]">{user.gender}</p>
                </span>
                <span className="flex flex-col items-center gap-1">
                  <p className="text-[20px] font-semibold">MBTI</p>
                  <p className="text-[18px]">{user.mbti}</p>
                </span>
              </div>
              <div className="text-[20px]">
                <p className="font-semibold">자기소개</p>
                <div className="mt-2 h-[150px] overflow-y-auto rounded-lg bg-[#eef4ff] p-4 scrollbar-hide">
                  {user.introduction}
                </div>
              </div>
            </div>
          </div>
          <Link href={`/mypage/${user.id}/myprofile/fixMyProfile`} className="mt-[-20px] flex justify-center">
            <div className="flex hidden items-center justify-center rounded-md bg-mainColor text-center font-bold sm:block">
              내 프로필 수정
            </div>
          </Link>
        </div>
        <div className="my-4 h-px w-full border-[#DEE5ED] bg-[#DEE5ED] opacity-60" />
        <div className="flex flex-row">
          <div className="self-start text-[#3e3e3e]">나의 반려동물 ({pets.length})</div>
          <Link
            href={`/mypage/${user.id}/myprofile/fixMyProfile`}
            className="mb-8 ml-4 min-h-[23px] overflow-hidden rounded-lg bg-[#EFEFF0] bg-zinc-100 px-1 py-1 text-xs leading-relaxed tracking-wide text-neutral-400"
          >
            반려동물 프로필 수정
          </Link>
        </div>
        <div className="flex flex-col items-center gap-6 overflow-y-scroll rounded-[10px] bg-[#EFEFF0] py-4 scrollbar-hide">
          <div>
            {pets?.map((pet) => (
              <Link key={pet.id} href={`/mypage/${id}/mypet/mypetprofile/${pet.id}`}>
                <div className="my-auto mt-2 flex flex-row items-center gap-12 rounded-xl bg-[#EFEFF0] px-[16px] py-[12px]">
                  <img
                    className="h-[100px] w-[100px] rounded bg-lime-300 object-cover"
                    src={pet.petImage ? pet.petImage : defaultPetImg}
                    alt="..."
                  />
                  <div>
                    <div className="text-lg font-semibold leading-normal">
                      {pet.petName}({pet.majorClass})
                    </div>
                    <div className="inline-flex h-5 items-start justify-start gap-2">
                      <div className="text-base font-normal leading-tight text-[#939396]">성별</div>
                      <div className="shrink grow basis-0 text-base font-normal leading-tight text-[#444447]">
                        {pet.male_female}
                      </div>
                    </div>
                    <div className="inline-flex h-5 items-start justify-start gap-2">
                      <div className="text-base font-normal leading-tight text-[#939396]">품종</div>
                      <div className="shrink grow basis-0 text-base font-normal leading-tight text-[#444447]">
                        {pet.minorClass}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* <div className="mb-5">
            <Link href={`/mypage/${id}/mypet/addmypetprofile`}>
              <div className="my-auto flex flex-row items-center justify-center gap-12 rounded-[20px] border-2 border-gray-400 bg-white px-[16px] py-[12px] font-bold sm:w-[420px]">
                추가하기
              </div>
            </Link>
          </div> */}
        </div>
        <div className="mt-5 flex w-full flex-col items-center sm:hidden">
          <div className="flex w-full flex-col items-center">
            <NavLink href={`/mypage/${id}/myprofile`}>내 정보</NavLink>
            <NavLink href={`/mypage/${id}/myposts`}>내 포스트</NavLink>
            <NavLink href={`/mypage/${id}/mymateposts`}>내 산책 메이트</NavLink>
          </div>
        </div>
      </div>
      {/* <div className="mt-10 flex gap-[15px]"></div> */}
    </div>
  );
};

export default MyProfile;
