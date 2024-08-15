"use client";

import { useAuthStore } from "@/zustand/useAuth";
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import LoginButton from "./auth/LoginBtn";
import LogoutButton from "../app/(private)/mypage2/_components/LogoutBtn";
import Link from "next/link";
import Image from "next/image";

const supabase = createClient();

const Header = () => {
  const [isUser, setIsUser] = useState(false);
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

  const handleGoBack = () => {
    router.back(); // 뒤로가기 기능
  };

  const getHeaderTitle = () => {
    if (pathname === "/") {
      return (
        <Image
          src="/assets/svg/_logo-small.svg"
          alt="홈"
          width={76}
          height={76}
          style={{ width: "auto", height: "auto" }}
        />
      );
    }

    if (pathname.startsWith("/mate/posts/")) {
      return "산책메이트 상세보기";
    }

    switch (pathname) {
      case "/community2":
        return "커뮤니티";
      case "/mate":
        return "산책메이트";
      case "/mate/post":
        return "산책메이트";
      case `/mypage/${user?.id}/myprofile`:
        return "마이페이지";
      default:
        return "";
    }
  };

  return pathname === "/message" ? (
    <></>
  ) : pathname === "/mate" ? (
    <header className="z-50 flex min-h-[4rem] w-full items-center justify-between bg-gray-50 px-4 py-2 text-black">
      <div className="flex items-center">
        <button onClick={handleGoBack} className="ml-2">
          <img src="/assets/svg/Arrow - Left 2.svg" alt="Back" />
        </button>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 transform text-lg font-bold">{getHeaderTitle()}</div>

      <div className="flex items-center">
        <Link href="/mate/filter" className="ml-2">
          <img src="/assets/svg/filter-lines.svg" alt="filter 이미지" />
        </Link>
      </div>
    </header>
  ) : (
    <header className="z-50 flex min-h-[4rem] w-full items-center justify-between bg-gray-50 px-4 py-2 text-black">
      {pathname !== "/" && (
        <div className="flex items-center">
          <button onClick={handleGoBack} className="ml-2">
            <img src="/assets/svg/Arrow - Left 2.svg" alt="Back" />
          </button>
        </div>
      )}

      <div className="absolute left-1/2 -translate-x-1/2 transform text-lg font-bold">{getHeaderTitle()}</div>

      <div className="flex items-center"></div>
    </header>
  );
};

export default Header;
