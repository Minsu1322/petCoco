"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Button from "@/components/Button";

const SignupForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
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
    validatePasswords(password, passwordCheck);
    validationPasswds(password);
  }, [password, passwordCheck, validatePasswords, validationPasswds]);

  const handleEmailCheck = async () => {
    try {
      await emailCheck(email);
      setIsEmailChecked(true);
    } catch (err) {
      console.error("이메일 검사의 에러", err);
      setIsEmailChecked(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChecked) {
      Swal.fire("개인정보 수집 및 이용 동의에 체크해주세요.");
      return;
    }
    if (passwordError || passwordValidateError) {
      return;
    }
    await signUp({ email, password, nickname });

    if (!error) {
      Swal.fire({
        title: "success",
        text: "회원가입이 완료되었습니다!",
        icon: "success"
      });
      router.push("/");
    } else {
      Swal.fire({
        title: "error",
        text: "회원가입이 실패하였습니다.",
        icon: "error"
      });
    }
  };

  return (
    <div className="mx-auto mt-[32px] min-h-screen">
      <div className="mx-auto w-full px-[16px]">
        <h1 className="text-center text-[30px] font-semibold">회원가입</h1>
        <div className="mt-10 flex flex-col items-center">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mt-[12px] h-[90px]">
              <label className="w-[100px] text-center text-[15px] font-semibold">닉네임</label>
              <div className="flex w-full items-center">
                <input
                  className="flex-grow rounded-[8px] border px-[16px] py-[12px] text-[0.9375rem] placeholder-[#999]"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임은 8자 이하로 작성해주세요"
                  maxLength={8}
                  required
                />
              </div>
            </div>
            <div className="mt-[12px] h-[90px]">
              <label className="w-[100px] text-center text-[15px] font-semibold">이메일</label>
              <div className="flex w-full items-center">
                <div className="flex flex-grow items-center">
                  <input
                    className="flex-grow rounded-[8px] border px-[16px] py-[12px] text-[0.9375rem] placeholder-[#999]"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 작성해주세요"
                    required
                  />
                  <button
                    type="button"
                    className="ml-[4px] rounded-[10px] border border-mainColor"
                    onClick={handleEmailCheck}
                  >
                    <p className="flex-grow whitespace-nowrap px-[16px] py-[12px] text-[13px] text-mainColor">
                      중복 확인
                    </p>
                  </button>
                </div>
              </div>
              {isEmailChecked && emailError && (
                <p
                  className={`mt-1 text-[12px] ${
                    emailError === "사용 가능한 이메일입니다." ? "text-blue-500" : "text-red-500"
                  }`}
                >
                  {emailError}
                </p>
              )}
            </div>
            <div className="mt-[12px] h-[90px]">
              <label className="w-[100px] text-center text-[15px] font-semibold">비밀번호</label>
              <div className="flex w-full items-center">
                <input
                  className="flex-grow rounded-[8px] border px-[16px] py-[12px] text-[0.9375rem] placeholder-[#999]"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 작성해주세요"
                  required
                />
              </div>
              {passwordValidateError && <p className="mt-1 text-[12px] text-red-500">{passwordValidateError}</p>}
            </div>
            <div className="mt-[12px] h-[90px]">
              <div className="mt-[12px]">
                <label className="w-[100px] text-center text-[15px] font-semibold">비밀번호 확인</label>
                <div className="flex w-full items-center">
                  <input
                    className="flex-grow rounded-[8px] border px-[16px] py-[12px] text-[0.9375rem] placeholder-[#999]"
                    type="password"
                    value={passwordCheck}
                    onChange={(e) => setPasswordCheck(e.target.value)}
                    placeholder="비밀번호를 다시 입력해주세요"
                    required
                  />
                </div>
              </div>
              {passwordError && <p className="mt-1 text-[12px] text-red-500">{passwordError}</p>}
            </div>
            <div className="mt-[32px] flex items-center">
              <input
                type="checkbox"
                className="mr-3 h-[20px] w-[20px] rounded-[8px] text-[15px]"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label className="text-[15px]">개인정보 수집 및 이용 동의(필수)</label>
            </div>

            <button
              className="mt-[32px] h-[44px] w-full rounded-[8px] border bg-mainColor text-[16px] text-white"
              type="submit"
            >
              회원가입 하기
            </button>
          </form>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default SignupForm;
