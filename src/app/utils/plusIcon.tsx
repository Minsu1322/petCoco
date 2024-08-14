import React from "react";

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
      <img src="/assets/svg/plus-01.svg" alt="plus icon" />
    </div>
  );
};

export default PlusIcon;
