"use client";

import { supabase } from "@/supabase/userClient";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const NicknameInfo = () => {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const { user, setError: setAuthError, setUser } = useAuthStore();
  const [error, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      setUser(user);
    };

    if (!user) {
      fetchUser();
    } else {
      const checkNickname = async () => {
        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("nickname")
          .eq("email", user.email)
          .single();

        if (profileError) {
          console.error("프로필 가져오기 에러", profileError.message);
        } else if (userProfile && userProfile.nickname) {
          router.push("/");
        }
      };
      checkNickname();
    }
  }, [user, setUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname) {
      setLocalError("닉네임을 입력해 주세요");
      return;
    }

    try {
      const { error: dbError } = await supabase.from("users").upsert([
        {
          email: user?.email,
          nickname
        }
      ]);

      if (dbError) {
        throw new Error(dbError.message);
      }

      router.push("/");
    } catch (error: any) {
      setLocalError(error.message);
    }
  };

  return (
    <div>
      <h1>닉네임 작성 페이지</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>닉네임</label>
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">완료</button>
      </form>
    </div>
  );
};

export default NicknameInfo;
