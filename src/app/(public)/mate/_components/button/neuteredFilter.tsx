"use client";

// import { useState } from "react";
import { Dispatch, SetStateAction } from "react";

interface NeuteredFilterProps {
  onSelect: (value: string) => void;
  selectedNeutered: string | null;
  setSelectedNeutered:  Dispatch<SetStateAction<string | null>>;
}

const NeuteredFilter = ({ onSelect, selectedNeutered, setSelectedNeutered }: NeuteredFilterProps) => {
 
  const handleSelect = (neutered: string) => {
    setSelectedNeutered(neutered);
    onSelect(neutered);
  };

  return (
    <div className="w-full mb-[1.5rem] ">
      <p className="mb-[0.69rem] text-[1rem] font-[400]">중성화 여부</p> 
    
    <div className="flex gap-x-[1rem]">
      <div
        className={`px-[1.66rem]  py-[1rem] flex justify-center whitespace-nowrap rounded-[1rem] text-[1rem] w-full text-[#999] font-[500] tracking-[0.0125rem] cursor-pointer ${
          selectedNeutered === "YES" ? 'bg-mainColor text-white ' : 'bg-[#EFEFF0] text-[#999]'
        }`}
        onClick={() => handleSelect("YES")}
      >
        했어요 
      </div>
      <div
        className={`px-[1.25rem] py-[1rem] flex justify-center whitespace-nowrap rounded-[1rem] text-[1rem] w-full text-[#999]  font-[500] tracking-[0.0125rem] cursor-pointer ${
          selectedNeutered === "NO" ? 'bg-mainColor text-white ' : 'bg-[#EFEFF0] text-[#999]'
        }`}
        onClick={() => handleSelect("NO")}
      >
        안 했어요
      </div>
      <div
        className={`px-[1.25rem] py-[1rem] flex justify-center whitespace-nowrap rounded-[1rem] text-[1rem]  w-full text-[#999] font-[500] tracking-[0.0125rem] cursor-pointer ${
          selectedNeutered === "all" ? 'bg-mainColor text-white ' : 'bg-[#EFEFF0] text-[#999]'
        }`}
        onClick={() => handleSelect("all")}
      >
        무관해요
      </div>  
    </div>
    </div>
  )
}

export default NeuteredFilter;