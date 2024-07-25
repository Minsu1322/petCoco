"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const {
    signUp,
    validatePasswords,
    emailCheck,
    validationPasswds,
    passwordError,
    passwordValidateError,
    error,
    emailError
  } = useAuthStore();

  useEffect(() => {
    const checkEmail = async () => {
      await emailCheck(email);
    };

    checkEmail();
  }, [email, emailCheck]);

  useEffect(() => {
    validatePasswords(password, passwordCheck);
    validationPasswds(password);
  }, [password, passwordCheck, validatePasswords, validationPasswds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChecked) {
      alert("개인정보 수집 및 이용 동의에 체크해주세요");
      return;
    }
    if (passwordError || passwordValidateError) {
      return;
    }
    if (emailError) {
      alert("중복된 이메일입니다.");
      return;
    }

    await signUp({ email, password, nickname });

    if (!error) {
      alert("회원가입이 완료되었습니다!");
      router.push("/signin");
    } else {
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="mt-20 w-full">
      <h1 className="text-center text-[30px] font-semibold">회원가입</h1>
      <div className="mt-10 flex flex-col items-center">
        <form onSubmit={handleSubmit}>
          <div className="h-[70px]">
            <div className="flex h-[60px] w-[550px] items-center border">
              <label className="ml-3 w-[100px] text-center">닉네임</label>
              <input
                className="ml-5 h-[30px] w-[380px]"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임은 8자 이하로 작성해주세요"
                maxLength={8}
                required
              />
            </div>
          </div>
          <div className="h-[70px]">
            <div className="mt-[30px] flex h-[60px] w-[550px] items-center border">
              <label className="ml-3 w-[100px] text-center">이메일</label>
              <input
                className="ml-5 h-[30px] w-[380px]"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 작성해주세요"
                required
              />
            </div>
          </div>
          <div className="h-[70px]">
            <div className="mt-[30px] flex h-[60px] w-[550px] items-center border">
              <label className="ml-3 w-[100px] text-center">비밀번호</label>
              <input
                className="ml-5 h-[30px] w-[380px]"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 작성해주세요"
                required
              />
            </div>
            {passwordValidateError && <p className="ml-2 mt-1 text-red-500">{passwordValidateError}</p>}
          </div>
          <div className="h-[70px]">
            <div className="mt-[30px] flex h-[60px] w-[550px] items-center border">
              <label className="ml-3 w-[100px] text-center">비밀번호 확인</label>
              <input
                className="ml-5 h-[30px] w-[380px]"
                type="password"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                placeholder="비밀번호를 다시 입력해주세요"
                required
              />
            </div>
            {passwordError && <p className="ml-2 mt-1 text-red-500">{passwordError}</p>}
          </div>

          <div className="mt-10 flex items-center">
            <input
              type="checkbox"
              className="mr-3 h-[20px] w-[20px]"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <label>개인정보 수집 및 이용 동의(필수)</label>
          </div>

          <button className="mt-10 h-[80px] w-[550px] border bg-black text-white" type="submit">
            회원가입 하기
          </button>
        </form>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SignupForm;
