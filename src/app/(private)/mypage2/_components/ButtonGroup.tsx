import React, { useEffect, useState } from "react";

type ButtonGroupInfo = {
  label: string;
  buttonInfos: ButtonInfo[];
  defaultValue: string;
  onChange: (value: string) => void;
};

type ButtonInfo = {
  text: string; // 보여주는 용
  value: string; // supabase에서 사용하는 용
};

const ButtonGroup = ({ label, buttonInfos, defaultValue, onChange }: ButtonGroupInfo) => {
  const [selectIndex, setSelectIndex] = useState<number>();

  useEffect(() => {
    const index = buttonInfos.findIndex((f) => f.value === defaultValue);
    setSelectIndex(index);
  }, []);

  const handleEvent = (info: ButtonInfo, index: number) => {
    setSelectIndex(index);
    onChange(info.value);
  };
  return (
    <>
      <label className="text-base font-normal leading-tight text-[#292826]">{label}</label>
      <div className="mt-1 flex gap-3">
        {buttonInfos.map((info, i) => {
          return (
            <Button key={i} onClick={() => handleEvent(info, i)} enable={i === selectIndex}>
              {info.text}
            </Button>
          );
        })}
      </div>
    </>
  );
};

type ButtonProps = {
  children: React.ReactNode;
  enable: boolean;
  onClick: () => void;
};

const Button = ({ children, enable, onClick }: ButtonProps) => {
  if (enable) {
    return (
      <button
        onClick={(e) => onClick()}
        className="h-[56px] w-full rounded-2xl bg-[#8E6EE8] text-center text-base font-normal text-[#FFFFFF]"
      >
        {children}
      </button>
    );
  } else {
    return (
      <button
        onClick={(e) => onClick()}
        className="h-[56px] w-full rounded-2xl bg-[#EFEFF0] text-center text-base font-normal text-[#999999]"
      >
        {children}
      </button>
    );
  }
};

export default ButtonGroup;
