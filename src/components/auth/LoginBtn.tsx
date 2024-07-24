import Link from "next/link";
import React from "react";

const LoginButton = () => {
  return (
    <Link href={"/signin"}>
      <button>로그인</button>
    </Link>
  );
};

export default LoginButton;
