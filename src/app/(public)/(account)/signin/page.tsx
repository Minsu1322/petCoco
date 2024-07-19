"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/zustand/authStore";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn({ email, password });
    alert("로그인이 완료되었습니다!");
  };

  return (
    <div>
      <h1>SignIn</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이메일 : </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>비밀번호 : </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">SignIn</button>
      </form>
      {error && <p style={{ color: "red" }}>(error)</p>}
    </div>
  );
};

export default page;
