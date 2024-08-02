"use client";

import Link from "next/link";
import LogoutButton from "./auth/LogoutBtn";
import { useAuthStore } from "@/zustand/useAuth";
import LoginButton from "./auth/LoginBtn";
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { useRouter } from "next/navigation";

const supabase = createClient();

const Header = () => {
  const [isUser, setIsUser] = useState(false);
  const { setSession } = useAuthStore();
  const router = useRouter();
  const { user } = useAuthStore((state) => ({
    user: state.user
  }));

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      setIsUser(!!session);
      setSession(session);
    };

    checkUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsUser(!!session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  const handleMypageClick = () => {
    if (user) {
      router.push(`/mypage/${user.id}/myprofile`);
    } else {
      router.push("/signin");
    }
  };

  return (
    <header className="flex w-full items-center justify-between bg-mainColor px-10 py-1 text-black">
      <img
        src="https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/logo_img/PetCocoLogo5.png?t=2024-08-01T11%3A47%3A18.222Z"
        alt="logo images"
        className="h-[70px] w-[70px] rounded-lg"
      />
      <div className="flex justify-center gap-12 font-semibold">
        <Link href={"/"}>
          <p className="h-[20px] w-[20px]">홈</p>
        </Link>

        <Link href={"/community"}>
          <p>커뮤니티</p>
        </Link>

        {isUser ? (
          <Link href={"/message"}>
            <p>대화함</p>
          </Link>
        ) : null}

        <Link href={"/mate"}>
          <p>산책 메이트</p>
        </Link>

        <button onClick={handleMypageClick}>
          <p>마이페이지</p>
        </button>
      </div>
      <div className="flex h-[70px] items-center justify-center font-semibold">
        <div className="mr-2 text-3xl">
          <HiOutlineUserCircle />
        </div>
        {isUser ? <LogoutButton /> : <LoginButton />}
      </div>
    </header>
  );
};

export default Header;
