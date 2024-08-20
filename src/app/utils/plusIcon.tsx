import React from "react";
import Image from "next/image";

interface PlusIconProps {
  handleLoginCheck: () => void;
}

const PlusIcon = ({ handleLoginCheck }: PlusIconProps) => {
  return (
    <div
      className="fixed bottom-[6.815rem] z-50 cursor-pointer rounded-full bg-mainColor p-[0.81rem] shadow-plusBtn"
      style={{
        right: "calc(50% - 187.5px + 0.56rem)"
      }}  
      onClick={handleLoginCheck}
    >
      <div className="w-[1.5rem] h-[1.5rem]">
        <Image src="/assets/svg/plus-01.svg" alt="plus icon" width={24} height={24} className="w-full h-full object-cover"/>
      </div>
    </div>
  );
};

export default PlusIcon;
