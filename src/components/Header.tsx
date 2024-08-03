"use client";

import Link from "next/link";
import LogoutButton from "./auth/LogoutBtn";
import { useAuthStore } from "@/zustand/useAuth";
import LoginButton from "./auth/LoginBtn";
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { button } from "@nextui-org/react";

const supabase = createClient();

const Header = () => {
  const [isUser, setIsUser] = useState(false);
  const { setSession } = useAuthStore();
  const { user } = useAuthStore((state) => ({
    user: state.user
  }));
  const router = useRouter();

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

  const handleMainClick = () => {
    router.push("/");
  };

  const handleCommunityClick = () => {
    router.push("/community");
  };

  const handleMessageClick = () => {
    router.push("/message");
  };

  const handleMateClick = () => {
    router.push("/mate");
  };

  return (
    <header className="flex w-full items-center justify-between bg-mainColor px-12 py-1 text-black">
      <div className="flex items-center justify-center">
        <img
          src="https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/logo_img/PetCocoLogo5.png?t=2024-08-01T11%3A47%3A18.222Z"
          alt="logo images"
          className="h-[70px] w-[70px] rounded-lg"
        />
        <div className="ml-[100px] flex justify-center gap-14 font-semibold">
          <button onClick={handleMainClick}>
            <p>홈</p>
          </button>

          <button onClick={handleCommunityClick}>
            <p>커뮤니티</p>
          </button>

          <button onClick={handleMateClick}>
            <p>산책 메이트</p>
          </button>

          {isUser ? (
            <button onClick={handleMessageClick}>
              <p>대화함</p>
            </button>
          ) : null}

          <button onClick={handleMypageClick}>
            <p>마이페이지</p>
          </button>
        </div>
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
