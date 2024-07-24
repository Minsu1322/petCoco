"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, error, setError, user, signInWithGoogle, signInWithKakao } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn({ email, password });
  };

  useEffect(() => {
    if (error) {
      alert(`아이디와 비밀번호를 확인해주세요.`);
      setError(null);
    }
  }, [error, setError]);

  useEffect(() => {
    if (user) {
      alert("로그인이 완료되었습니다!");
      router.push("/");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleKakaoSignIn = async () => {
    await signInWithKakao();
  };

  return (
    <div className="mt-20 w-full">
      <h1 className="text-center text-[30px] font-semibold">로그인</h1>
      <div className="mt-10 flex flex-col items-center">
        <form onSubmit={handleSubmit}>
          <div className="flex h-[80px] w-[550px] items-center border">
            <label className="ml-5 w-[70px] text-center">이메일</label>
            <input
              className="ml-5 h-[40px] w-[420px]"
              type="email"
              value={email}
              placeholder="이메일을 입력하세요"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-[30px] flex h-[80px] w-[550px] items-center border">
            <label className="ml-5 w-[70px] text-center">비밀번호</label>
            <input
              className="ml-5 h-[40px] w-[420px]"
              type="password"
              value={password}
              placeholder="비밀번호를 입력하세요"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-5 h-[30px]">
            <label className="float-right">비밀번호 찾기</label>
            <p className="float-right ml-2 mr-2">|</p>
            <label className="float-right">아이디 찾기</label>
          </div>
          <button className="mt-10 h-[80px] w-[550px] border bg-black text-white" type="submit">
            로그인 하기
          </button>
          <div className="mt-5 flex justify-center">
            <p className="mr-3">아직 계정이 없으신가요?</p>
            <Link href={"/signup"}>
              <p className="text-gray-500">회원가입 하기</p>
            </Link>
          </div>
        </form>
        <button onClick={handleGoogleSignIn}>구글 로그인</button>
        <button onClick={handleKakaoSignIn}>카카오 로그인</button>
        {error && <p style={{ color: "red" }}>(error)</p>}
      </div>
    </div>
  );
};

export default LoginForm;
