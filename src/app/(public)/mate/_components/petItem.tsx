"use client";

import React from "react";
import { matepostpetsType } from "@/types/mate.type";

interface PetItemProps {
  pet: matepostpetsType;
}

const PetItem = ({ pet }: PetItemProps) => {
  return (
    <div className="flex gap-x-[0.625rem] w-full rounded-[0.85rem] border-[#C2C0BD] border px-[0.75rem] py-[0.69rem]">
      <div className="flex flex-col items-center justify-center mx-[1.19rem]">
        <div className="mt-[0.44rem] flex items-center justify-center rounded-full bg-gray-100 px-[0.75rem] py-[0.12rem]">
          <p className="text-[0.625rem] text-mainColor">호스트 반려견</p>
        </div>
      </div>
      <div>
      <p className="text-[1rem]">{pet.age}살, {pet.male_female === "수" ? "남" : "여"}아</p>
        <div className="flex gap-x-[0.5rem]">
          <p className="text-[#939396] font-[400]">몸무게</p>
          <p className="text-[1rem] font-[400]">{pet.weight}kg</p>
        </div>
        <div className="flex gap-x-[0.5rem]">
          <p className="text-[#939396] font-[400]">중성화 여부</p>
          <p className="text-[1rem] font-[400]">{pet.neutered ? "했어요" : "안했어요"}</p>
        </div>
        <div className="flex gap-x-[0.5rem]">
          <p className="text-[#939396] font-[400]">성향</p>
          <p className="text-[1rem] w-auto max-w-[70px] overflow-hidden text-ellipsis whitespace-nowrap font-[400]">{pet.characteristics}</p>
        </div>
      </div>
    </div>
  );
};

export default PetItem;


 {/* <div className="h-[3.125rem] w-[3.125rem] mx-[1.19rem]"> */}
      {/* <Image
        src={
          pet.petImage
            ? pet.petImage
            : "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/post_image/1722324396777_xo2ka9.jpg"
        }
        alt="반려견 프로필 이미지"
        width={50}
        height={50}
        className="h-full w-full rounded-[0.75rem] object-cover"
      /> */}
      {/* </div> */}
      {/* <p className="text-[0.875rem] mt-[0.60rem] font-[800] text-center">{pet.petName}</p> */}