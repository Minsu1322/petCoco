"use client";

import { UsersPetType } from "@/types/auth.type";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { defaultUserImg, defaultPetImg } from "@/components/DefaultImg";

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
    <div className="flex flex-col items-center justify-center">
      {/* <img
        className="h-[170px] w-[170px] items-center justify-center rounded-full bg-lime-300 object-cover"
        src={user.profile_img}
        alt=""
      /> */}
      <div className="flex h-80 flex-col items-center justify-center">
        <div className="my-auto flex flex-col items-center justify-center px-[15px] text-[24px] sm:text-[48px] lg:px-0">
          {/* <img className="h-[170px] w-[170px] rounded-full bg-lime-300 object-cover" src={user.profile_img} alt="" /> */}
          <span className="flex items-center font-bold text-[#4885f8] sm:text-[40px]">
            {user.nickname}
            <div className="text-[36px] text-black">님 반갑습니다.</div>
          </span>

          {/* <Link
            className="rounded border bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
            href={`/mypage/${user.id}/myprofile`}
          >
            내 프로필
          </Link> */}
        </div>
      </div>
      <div className="flex items-center gap-20">
        <div className="flex flex-col gap-[50px]">
          <div className="flex items-center gap-20">
            <img
              className="h-[170px] w-[170px] rounded-full bg-lime-300 object-cover"
              src={user.profile_img || defaultUserImg}
              alt=""
            />
            <div className="my-auto flex flex-col items-start justify-center rounded-lg px-[15px] lg:px-0">
              <br />
              <span className="text-[24px] text-[#000000] sm:text-[20px]">연령대: {user.age}</span>
              <br />
              <span className="text-[24px] text-[#000000] sm:text-[20px]">성별: {user.gender}</span>
              <br />
              <span className="text-[24px] text-[#000000] sm:text-[20px]">MBTI: {user.mbti}</span>
              <br />
              <div className="max-w-[300px] break-words text-[24px] text-[#000000] sm:text-[20px]">
                자기소개: {user.introduction}
              </div>
            </div>
          </div>
          <Link
            className="rounded border border-[#C9C9C9] bg-mainColor px-4 py-3 text-center text-[16px] font-semibold text-black"
            href={`/mypage/${user.id}/myprofile/fixMyProfile`}
          >
            변경하기
          </Link>
        </div>
        <div className="ml-20 flex h-[340px] w-[540px] flex-col items-center gap-4 overflow-y-scroll rounded-[10px] bg-gray-200 py-4 scrollbar-hide">
          {pets?.map((pet) => (
            <Link key={pet.id} href={`/mypage/${id}/mypet/mypetprofile/${pet.id}`}>
              <div className="my-auto flex w-[500px] flex-row items-center gap-12 rounded-[20px] border-2 border-gray-400 bg-white px-[16px] py-[12px]">
                <img
                  className="h-[100px] w-[100px] rounded-full bg-lime-300 object-cover"
                  src={pet.petImage ? pet.petImage : defaultPetImg}
                  alt="..."
                />
                <div>
                  <div className="text-[24px] text-[#000000] sm:text-[20px]">이름:{pet.petName}</div>
                  <div className="text-[24px] text-mainColor sm:text-[20px]">{pet.majorClass}</div>
                  <div className="text-[24px] text-mainColor sm:text-[20px]">{pet.minorClass}</div>
                </div>
              </div>
            </Link>
          ))}
          <Link href={`/mypage/${id}/mypet/addmypetprofile`}>
            <div className="my-auto flex w-[500px] flex-row items-center justify-center gap-12 rounded-[20px] border-2 border-gray-400 bg-white px-[16px] py-[12px] font-bold">
              추가하기
            </div>
          </Link>
          {/* <div className="mt-5 flex gap-[15px]">
            <Link
              className="rounded border border-[#C9C9C9] bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
              href={`/mypage/${id}/mypet`}
            >
              내 애완동물
            </Link>
          </div> */}
        </div>
      </div>
      <div className="mt-20 flex gap-[15px]">
        {/* <Link
              className="rounded border border-[#C9C9C9] bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
              href={`/mypage/${user.id}`}
            >
              뒤로가기
            </Link> */}
      </div>
    </div>
  );
};

export default MyProfile;
