// Header 임시 파일
"use client";

import Link from "next/link";
import LogoutButton from "./auth/LogoutBtn";
import { useAuthStore } from "@/zustand/useAuth";
import LoginButton from "./auth/LoginBtn";
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";

const supabase = createClient();

const Header = () => {
  const [isUser, setIsUser] = useState(false);
  const { setSession } = useAuthStore();

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

  return (
    <header className="w-full items-center bg-mainColor px-10 py-6 text-black">
      <div className="flex justify-center gap-6">
        <Link href={"/"}>
          <p>홈</p>
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
        {isUser ? <LogoutButton /> : <LoginButton />}
      </div>
    </header>
  );
};

export default Header;
