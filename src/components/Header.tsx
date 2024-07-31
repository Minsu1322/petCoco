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
    <header className="mb-6 w-full items-center bg-mainColor px-10 py-6 text-black">
      <div className="flex justify-center gap-6">
        <Link href={"/"}>
          <p>홈(임시 헤더)</p>
        </Link>

        <Link href={"/community"}>
          <p>커뮤니티</p>
        </Link>
        <Link href={"/mate"}>
          <p>산책 메이트</p>
        </Link>
        {isUser ? <LogoutButton /> : <LoginButton />}
        {isUser ? (
          <Link href={"/message"}>
            <p>메시지(미완성)</p>
          </Link>
        ) : (
          <p>쪽지함로그인필요</p>
        )}
      </div>
    </header>
  );
};

export default Header;
