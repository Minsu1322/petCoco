"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import Swal from "sweetalert2";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, error, setError, user, signInWithGoogle, signInWithKakao } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signIn({ email, password });
    if (success) {
      Swal.fire({
        title: "success",
        text: "로그인이 완료되었습니다!",
        icon: "success"
      });
      router.push("/");
    }
  };

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "error",
        text: "아이디와 비밀번호를 확인해주세요.",
        icon: "error"
      });
      setError(null);
    }
  }, [error, setError]);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleKakaoSignIn = async () => {
    await signInWithKakao();
  };

  return (
    <div className="mt-10 w-full">
      <h1 className="text-center text-[30px] font-semibold">로그인</h1>
      <div className="mt-14 flex flex-col items-center">
        <form onSubmit={handleSubmit}>
          <div className="flex h-[60px] w-[550px] items-center rounded-[10px] border">
            <label className="ml-5 w-[70px] text-center">이메일</label>
            <input
              className="ml-5 h-[35px] w-[420px] pl-2"
              type="email"
              value={email}
              placeholder="이메일을 입력하세요"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-[20px] flex h-[60px] w-[550px] items-center rounded-[10px] border">
            <label className="ml-5 w-[70px] text-center">비밀번호</label>
            <input
              className="ml-5 h-[35px] w-[420px] pl-2"
              type="password"
              value={password}
              placeholder="비밀번호를 입력하세요"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="mt-[80px] h-[70px] w-[550px] rounded-[16px] border bg-black text-white" type="submit">
            로그인 하기
          </button>
          <div className="mt-5 flex justify-center">
            <p className="mr-3">아직 계정이 없으신가요?</p>
            <Link href={"/signup"}>
              <p className="text-gray-500">회원가입 하기</p>
            </Link>
          </div>
        </form>
        <div className="mt-12 flex w-[550px] items-center justify-between">
          <div className="h-[1px] w-[180px] border"></div>
          <p>SNS 계정으로 로그인하기</p>
          <div className="h-[1px] w-[180px] border"></div>
        </div>
        <div className="mt-5 flex w-[550px]">
          <button
            onClick={handleKakaoSignIn}
            className="mr-5 flex h-[60px] w-full items-center justify-center rounded-[8px] bg-yellow-400"
          >
            <RiKakaoTalkFill className="mr-2 h-[24px] w-[24px]" />
            <p>카카오 로그인</p>
          </button>
          <button
            onClick={handleGoogleSignIn}
            className="flex h-[60px] w-full items-center justify-center rounded-[8px] border"
          >
            <FcGoogle className="mr-2 h-[24px] w-[24px]" />
            <p>Sign in with Google</p>
          </button>
        </div>
        {error && <p style={{ color: "red" }}>(error)</p>}
      </div>
    </div>
  );
};

export default LoginForm;
