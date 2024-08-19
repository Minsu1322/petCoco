"use client";

// import { useState } from "react";
import { Dispatch, SetStateAction } from "react";

interface Male_femaleFilterProps {
  onSelect: (value: string) => void;
  selectedGender: string | null;
  setSelectedGender: Dispatch<SetStateAction<string | null>>;
}

const Male_femaleFilter = ({onSelect, selectedGender, setSelectedGender }: Male_femaleFilterProps) => {


  const handleSelect = (value: string) => {
    setSelectedGender(value);
    onSelect(value);
  };

  return (
    <div className="w-full mb-[1.5rem]">
    <p className="mb-[0.69rem] text-[1rem] font-[400]">성별</p>
    <div className="flex gap-x-[0.69rem]">
      <div
        className={`px-[4.06rem] py-[1rem] flex justify-center rounded-[1rem] text-[1rem] cursor-pointer w-full font-[500]  ${selectedGender === "수" ? 'bg-mainColor text-white ' : 'bg-[#EFEFF0] text-[#999]' }`}
        onClick={() => handleSelect('수')}
      >
        남아
      </div>
      <div
        className={`px-[4.06rem] py-[1rem] flex justify-center rounded-[1rem] text-[1rem] cursor-pointer w-full text-[#999] font-[500]  ${selectedGender === "암" ? 'bg-mainColor text-white' : 'bg-[#EFEFF0] text-[#999]' }`}
        onClick={() => handleSelect('암')}
      >
        여아
      </div>  
    </div>
    </div>
  )
}

export default Male_femaleFilter;