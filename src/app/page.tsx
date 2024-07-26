"use client";

import { useAuthStore } from "@/zustand/useAuth";

export default function Home() {
<<<<<<< HEAD
=======
  const { user } = useAuthStore();

  console.log(user);
>>>>>>> dev
  return <main className="flex min-h-screen flex-col items-center justify-between p-24">...</main>;
}
