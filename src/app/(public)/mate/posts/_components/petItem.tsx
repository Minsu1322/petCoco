"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

import { matepostpetsType } from "@/types/mate.type";

interface PetItemProps {
  pet: matepostpetsType;
}

const PetItem = ({ pet }: PetItemProps) => {
  const petId = pet.pet_id;

  const {
    data: post,
    isPending,
    error
  } = useQuery({
    queryKey: ["usersPets", petId],
    queryFn: async () => {
      const response = await fetch(`/api/mate/pets/${petId}`);
      const data = response.json();
      //  console.log(data);
      return data;
    }
  });
  // 값이 없을 때 빈 문자열로 처리
  const pet_name = pet.pet_name ? `${pet.pet_name}` : "익명";
  const age = pet.age ? `${pet.age}살` : "";
  const gender = pet.male_female === "수" ? "남" : "여";
  const weight = pet.weight ? `${pet.weight}kg` : "";
  const neutered = pet.neutered ? "했어요" : "안했어요";
  const characteristics = pet.characteristics || "";

  return (
    <div className="mb-[0.44rem] flex w-full flex-col rounded-[0.85rem] border border-[#C2C0BD] px-[0.75rem] py-[0.69rem]">
      <div className="ml-[0.75rem]">
        <div className="flex w-full justify-between">
          <div className="flex flex-col">
            <div>
              <p className="truncate text-[1rem]">{pet_name}</p>
            </div>

            <div className="flex justify-center">
              <p>
                ({age}, {gender}아)
              </p>
            </div>
          </div>

          <div className="ml-auto whitespace-nowrap">
            <p className="text-[0.625rem] text-mainColor">호스트 반려견</p>
          </div>
        </div>

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
          <p className="w-[148px] overflow-hidden text-ellipsis whitespace-nowrap text-[1rem] font-[400]">
            {characteristics}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetItem;
