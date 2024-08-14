"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import Swal from "sweetalert2";

const supabase = createClient();

const LogoutButton = () => {
  const { signOut } = useAuthStore();
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>(null);
  const { user } = useAuthStore((state) => ({
    user: state.user
  }));

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const { data, error } = await supabase.from("users").select("nickname").eq("id", user.id).single();

        if (error) {
          console.error("Error fetching nickname:", error);
        } else {
          setNickname(data.nickname);
        }
      } catch (error) {
        console.error("Error fetching nickname:", error);
      }
    };

    fetchNickname();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    // alert("로그아웃 되었습니다!");
    Swal.fire({
      title: "완료!",
      text: "로그아웃 되었습니다!",
      icon: "success"
    });
    router.push("/signin");
  };

  // const handleMypageClick = () => {
  //   if (user) {
  //     router.push(`/mypage/${user.id}/myprofile`);
  //   } else {
  //     router.push("/signin");
  //   }
  // };

  return (
    <div className="mb-20 flex">
      {/* <button onClick={handleMypageClick}>
        <p className="mr-2">{nickname}</p>
      </button> */}
      {/* <p>|</p> */}
      <button
        onClick={handleLogout}
        className="mt-[4rem] w-full rounded-[0.5rem] border border-mainColor text-[16px] text-mainColor"
      >
        <p className="p-[0.5rem]">로그아웃</p>
      </button>
    </div>
  );
};

export default LogoutButton;
