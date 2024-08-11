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
    <div className="mx-auto mt-[32px] w-[375px]">
      <div className="mx-auto max-w-[calc(100%-32px)]">
        <h1 className="text-center text-[30px] font-semibold">로그인</h1>
        <div className="mt-10 flex flex-col items-center">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mt-[12px] h-[90px]">
              <label className="w-[100px] text-center text-[15px] font-semibold">닉네임</label>
              <div className="flex w-full items-center">
                <input
                  className="flex-grow rounded-[8px] border px-[16px] py-[12px] text-[15px]"
                  type="email"
                  value={email}
                  placeholder="이메일을 입력하세요"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mt-[12px]">
              <label className="w-[100px] text-center text-[15px] font-semibold">비밀번호</label>
              <div className="flex w-full items-center">
                <input
                  className="flex-grow rounded-[8px] border px-[16px] py-[12px] text-[15px]"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 작성해주세요"
                  required
                />
              </div>
            </div>
            <button
              className="mt-[32px] h-[44px] w-full rounded-[8px] border bg-black text-[16px] text-white"
              type="submit"
            >
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
    </div>
  );
};

export default LoginForm;
