"use client";

import { useState } from "react";

interface NeuteredFilterProps {
  onSelect: (value: string) => void;
}

const NeuteredFilter = ({ onSelect }: NeuteredFilterProps) => {
  const [selectedNeutered, setSelectedNeutered] = useState<string | null>(null);

  const handleSelect = (neutered: string) => {
    setSelectedNeutered(neutered);
    onSelect(neutered);
  };

  return (
    <div className="w-full mb-[1.5rem]">
      <p className="mb-[0.69rem] text-[1rem] font-[400]">중성화 여부</p> 
    
    <div className="flex gap-x-[1rem]">
      <div
        className={`px-[1.66rem] py-[1rem] rounded-[1rem] text-[1rem] tracking-[0.0125rem] cursor-pointer ${
          selectedNeutered === "true" ? 'bg-mainColor' : 'bg-[#EFEFF0]' 
        }`}
        onClick={() => handleSelect("true")}
      >
        했어요 
      </div>
      <div
        className={`px-[1.66rem] py-[1rem] rounded-[1rem] text-[1rem] tracking-[0.0125rem] cursor-pointer ${
          selectedNeutered === "false" ? 'bg-mainColor' : 'bg-[#EFEFF0]' 
        }`}
        onClick={() => handleSelect("false")}
      >
        안했어요
      </div>
      <div
        className={`px-[1.66rem] py-[1rem] rounded-[1rem] text-[1rem] tracking-[0.0125rem] cursor-pointer ${
          selectedNeutered === "all" ? 'bg-mainColor' : 'bg-[#EFEFF0]' 
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