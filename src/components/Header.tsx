"use client";

import Link from "next/link";
import LogoutButton from "./auth/LogoutBtn";
import { useAuthStore } from "@/zustand/useAuth";
import LoginButton from "./auth/LoginBtn";
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { HiOutlineUserCircle, HiMenu } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { button } from "@nextui-org/react";
import { usePathname } from "next/navigation";

const supabase = createClient();

const Header = () => {
  const [isUser, setIsUser] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setSession } = useAuthStore();
  const { user } = useAuthStore((state) => ({
    user: state.user
  }));
  const router = useRouter();
  const pathname = usePathname();

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return pathname === "/message" ? (
    <></>
  ) : (
    <header className="z-50 flex w-full items-center justify-between bg-mainColor px-4 py-1 text-black md:px-12">
      <div className="flex w-full items-center justify-between md:w-auto">
        <img
          src="https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/logo_img/PetCocoLogo5.png?t=2024-08-01T11%3A47%3A18.222Z"
          alt="logo images"
          className="h-[50px] w-[50px] rounded-lg md:h-[70px] md:w-[70px]"
        />
        <button className="text-3xl md:hidden" onClick={toggleMenu}>
          <HiMenu />
        </button>
      </div>
      <div className="hidden md:ml-[100px] md:flex md:items-center md:justify-center md:gap-14 md:font-semibold">
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
      <div className="hidden md:flex md:h-[70px] md:items-center md:justify-center md:font-semibold">
        <div className="mr-2 text-3xl">
          <HiOutlineUserCircle />
        </div>
        {isUser ? <LogoutButton /> : <LoginButton />}
      </div>
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-[60px] bg-white shadow-lg md:hidden">
          <div className="flex flex-col items-center gap-4 py-4">
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
          <div className="flex items-center justify-center py-4">
            <div className="mr-2 text-3xl">
              <HiOutlineUserCircle />
            </div>
            {isUser ? <LogoutButton /> : <LoginButton />}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
