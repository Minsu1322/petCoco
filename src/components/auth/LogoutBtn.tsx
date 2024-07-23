"use client";

import React from "react";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const { signOut } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    alert("로그아웃 되었습니다!");
    router.push("/signin");
  };

  return <button onClick={handleLogout}>로그아웃</button>;
};

export default LogoutButton;
