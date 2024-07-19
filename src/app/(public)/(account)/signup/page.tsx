"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/zustand/authStore";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const { signUp, validatePasswords, passwordError, error } = useAuthStore();

  useEffect(() => {
    validatePasswords(password, passwordCheck);
  }, [password, passwordCheck, validatePasswords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordError) {
      return;
    }
    await signUp({ email, password, nickname });
    alert("회원가입이 완료되었습니다!");
    router.push("/signin");
  };

  return (
    <div>
      <h1>SignUp</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" value={passwordCheck} onChange={(e) => setPasswordCheck(e.target.value)} required />
          {passwordError && <p className="text-red-500">{passwordError}</p>}
        </div>
        <div>
          <label>Nickname:</label>
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
        </div>
        <button type="submit">SignUp</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default page;
