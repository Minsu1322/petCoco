import React from "react";

type ButtonProps = {
  onClick?: () => void;
  className: string;
  text: string;
};

const Button = ({ onClick, className, text }: ButtonProps) => {
  return (
    <div className={className} onClick={onClick}>
        <p>{text}</p>
    </div>
  );
};

export default Button;
