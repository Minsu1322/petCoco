"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { useAuthStore } from "@/zustand/useAuth";
const supabase = createClient();
const GoogleCallback = () => {
  const router = useRouter();
  const { setUser, setError } = useAuthStore();
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 세션 가져오기
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw new Error(sessionError.message);
        }
        const user = sessionData.session?.user;
        if (!user || !user.email) {
          throw new Error("사용자 세션 또는 이메일이 없습니다");
        }
        setUser(user);
        // 사용자 프로필 가져오기
        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("nickname")
          .eq("email", user.email)
          .single();
        if (profileError) {
          throw new Error(profileError.message);
        }
        if (userProfile && userProfile.nickname) {
          router.push("/");
        } else {
          router.push("/nickname");
        }
      } catch (error: any) {
        console.error("OAuth 콜백 에러", error.message);
        setError(error.message);
        router.push("/");
      }
    };
    handleAuthCallback();
  }, [router, setUser, setError]);
  return <div>Loading...</div>;
};
export default GoogleCallback;
