import Link from "next/link";
import React from "react";

const LoginButton = () => {
  return (
    <div className="flex">
      <Link href={"/signin"}>
        <button className="mr-2">로그인</button>
      </Link>
      <p>|</p>
      <Link href={"/signup"}>
        <button className="ml-2">회원가입</button>
      </Link>
    </div>
  );
};

export default LoginButton;
