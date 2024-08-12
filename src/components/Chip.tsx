import React from "react";

type ChipProps = {
  onClick?: () => void;
  className: string;
  text: string;
  textClassName?: string
};

const Chip = ({ onClick, className, text, textClassName }: ChipProps) => {
  return (
    <div className={className} onClick={onClick}>
        <p className={textClassName}>{text}</p>
    </div>
  );
};

export default Chip;
