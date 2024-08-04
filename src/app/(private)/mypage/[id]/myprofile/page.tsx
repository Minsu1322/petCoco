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
    <div className="">
      <div className="flex items-center">
        <div className="border-gray flex h-[500px] w-[500px] flex-col gap-[50px] rounded-lg border">
          <div className="mt-5 flex items-center">
            <img
              className="ml-5 mr-5 h-[60px] w-[60px] rounded-full bg-mainColor object-cover"
              src={user.profile_img || defaultUserImg}
              alt=""
            />
            <div className="flex flex-col">
              <span className="flex items-center text-[30px] font-bold text-[#4885f8]">
                {user.nickname}
                <div className="ml-2 text-[30px] text-black">님 반갑습니다.</div>
              </span>
            </div>
          </div>
          <div className="flex justify-center">
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
            <p className="flex h-[40px] w-[200px] items-center justify-center rounded-md bg-mainColor">변경하기</p>
          </Link>
        </div>
        <div className="border-gray ml-20 flex h-[500px] w-[500px] flex-col items-center gap-6 overflow-y-scroll rounded-[10px] border py-4 scrollbar-hide">
          {pets?.map((pet) => (
            <Link key={pet.id} href={`/mypage/${id}/mypet/mypetprofile/${pet.id}`}>
              <div className="border-gray my-auto mt-2 flex w-[400px] flex-row items-center gap-12 rounded-xl border-2 bg-white px-[16px] py-[12px]">
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
          <div className="fixed mt-[420px]">
            <Link href={`/mypage/${id}/mypet/addmypetprofile`}>
              <div className="my-auto flex w-[420px] flex-row items-center justify-center gap-12 rounded-[20px] border-2 border-gray-400 bg-white px-[16px] py-[12px] font-bold">
                추가하기
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* <div className="mt-10 flex gap-[15px]"></div> */}
    </div>
  );
};

export default MyProfile;
