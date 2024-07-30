"use client";

import { UsersPetType } from "@/types/auth.type";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import Router from "next/router";
type PetType = UsersPetType;
const mypet = () => {
  const params = useParams();
  const id = params.id;
  console.log(id);

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
    isPending,
    isError
  } = useQuery<PetType[]>({
    queryKey: ["pets", id],
    queryFn: getPetData
  });
  if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (isError) {
    return <div className="flex h-screen items-center justify-center">데이터 로딩 실패</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="items-end justify-end justify-items-end">
        <Link
          className="rounded border border-[#C9C9C9] bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
          href={`/mypage/${id}/mypet/addmypetprofile`}
        >
          추가하기
        </Link>
        &nbsp;
        <Link
          className="rounded border border-[#C9C9C9] bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
          href={`/mypage/${id}`}
        >
          뒤로가기
        </Link>
      </div>
      <br />
      {pets.map((pet) => (
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

            <div className="mt-5 flex gap-[15px]">
              <Link
                className="rounded border border-[#C9C9C9] bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
                href={`/mypage/${id}/mypet/fixmypetprofile/${pet.id}`}
              >
                변경하기
              </Link>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default mypet;
