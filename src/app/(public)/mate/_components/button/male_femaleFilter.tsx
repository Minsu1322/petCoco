"use client";

import { useState } from "react";

interface Male_femaleFilterProps {
  onSelect: (value: string) => void;
}

const Male_femaleFilter = ({onSelect}: Male_femaleFilterProps) => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelectedGender(value);
    onSelect(value);
  };

  return (
    <div className="w-full mb-[1.5rem]">
    <p className="mb-[0.69rem] text-[1rem] font-[400]">성별</p>
    <div className="flex gap-x-[0.69rem]">
      <div
        className={`px-[4.06rem] py-[1rem] rounded-[1rem] ${selectedGender === "male" ? 'bg-mainColor' : 'bg-[#EFEFF0]' }`}
        onClick={() => handleSelect('male')}
      >
        남아
      </div>
      <div
        className={`px-[4.06rem] py-[1rem] rounded-[1rem] ${selectedGender === "female" ? 'bg-mainColor' : 'bg-[#EFEFF0]' }`}
        onClick={() => handleSelect('female')}
      >
        여아
      </div>  
    </div>
    </div>
  )
}

export default Male_femaleFilter;