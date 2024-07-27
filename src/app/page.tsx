"use client";

import { useAuthStore } from "@/zustand/useAuth";

export default function Home() {
  const { user } = useAuthStore();

  console.log(user);
  return <main className="flex min-h-screen flex-col items-center justify-between p-24">...</main>;
}
