"use client";

import { createClient } from "@/supabase/client";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const supabase = createClient();

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
    <div className="mx-auto mt-[32px] w-[375px]">
      <div className="mx-auto max-w-[calc(100%-32px)]">
        <h1 className="text-center text-[30px] font-semibold">닉네임 작성 페이지</h1>
        <form onSubmit={handleSubmit}>
          <div className="mt-[12px] h-[90px]">
            <label className="w-[100px] text-center text-[15px] font-semibold">닉네임</label>
            <div className="flex w-full items-center">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임은 5자 이하로 작성해주세요"
                className="flex-grow rounded-[8px] border px-[16px] py-[12px] text-[0.9375rem] placeholder-[#999]"
                maxLength={4}
                required
              />
            </div>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            className="mt-[4rem] w-full rounded-[0.5rem] border bg-mainColor text-[16px] text-white"
          >
            <p className="p-[0.5rem]">완료</p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default NicknameInfo;
