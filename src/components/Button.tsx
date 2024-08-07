import React from "react";

type ButtonProps = {
  onClick?: () => void;
  className: string;
  text: string;
};

const Button = ({ onClick, className, text }: ButtonProps) => {
  return (
    <button className={className} onClick={onClick}>
        <p>{text}</p>
    </button>
  );
};

export default Button;
