import React from "react";
import { matepostpetsType } from "@/types/mate.type";

interface PetItemProps {
  pet: matepostpetsType;
}

const PetItem = ({ pet }: PetItemProps) => {
  // 값이 없을 때 빈 문자열로 처리
  const age = pet.age ? `${pet.age}살` : "";
  const gender = pet.male_female === "수" ? "남" : "여";
  const weight = pet.weight ? `${pet.weight}kg` : "";
  const neutered = pet.neutered ? "했어요" : "안했어요";
  const characteristics = pet.characteristics || "";

  return (
    <div className="mb-[0.44rem] flex w-full justify-between gap-x-[1rem] rounded-[0.85rem] border border-[#C2C0BD] px-[0.75rem] py-[0.69rem]">
      <div className="w-full ml-[0.75rem] w-[55%]">
        <p className="text-[1rem]">
          {age}, {gender}아
        </p>
        <div className="flex gap-x-[0.5rem]">
          <p className="font-[400] text-[#939396]">몸무게</p>
          <p className="text-[1rem] font-[400]">{weight}</p>
        </div>
        <div className="flex gap-x-[0.5rem]">
          <p className="font-[400] text-[#939396]">중성화 여부</p>
          <p className="text-[1rem] font-[400]">{neutered}</p>
        </div>
        <div className="flex gap-x-[0.5rem]">
          <p className="font-[400] text-[#939396]">성향</p>
          <p className="w-auto max-w-[70px] overflow-hidden text-ellipsis whitespace-nowrap text-[1rem] font-[400]">
            {characteristics}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end justify-start w-[45%]">
        <div className="flex items-center justify-center rounded-full bg-gray-100 px-[0.75rem] py-[0.12rem]">
          <p className="text-[0.625rem] text-mainColor">호스트 반려견</p>
        </div>
      </div>
    </div>
  );
};

export default PetItem;
