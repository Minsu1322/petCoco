import { create } from "zustand";
import { supabase } from "@/supabase/userClient";
import { UserInfoType } from "@/types/auth.type";

interface AuthStore {
  user: any;
  error: string | null;
  passwordError: string | null;
  signUp: (credentials: Omit<UserInfoType, "created_at" | "id" | "profile_img" | "passwordCheck">) => Promise<void>;
  signIn: (credentials: Pick<UserInfoType, "email" | "password">) => Promise<void>;
  validatePasswords: (password: string, passwordCheck: string) => void;
  setUser: (user: any) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  error: null,
  passwordError: null,
  signUp: async (credentials) => {
    const { email, password, nickname } = credentials;

    try {
      const { data: user, error } = await supabase.auth.signUp({
        email: email as string,
        password
      });
      if (error) {
        throw new Error(error.message);
      }

      const { data, error: profileError } = await supabase.from("users").upsert([
        {
          email,
          nickname
        }
      ]);

      if (profileError) {
        throw new Error(profileError.message);
      }
      set({ user, error: null });
    } catch (error: any) {
      console.error("회원가입 에러", error.message);
    }
  },
  signIn: async (credentials) => {
    const { email, password } = credentials;

    try {
      const { data: user, error } = await supabase.auth.signInWithPassword({
        email: email as string,
        password
      });
      if (error) {
        throw new Error(error.message);
      }
      set({ user, error: null });
    } catch (error: any) {
      console.error("로그인 에러", error.message);
      set({ error: error.message });
    }
  },
  validatePasswords: (password, passwordCheck) => {
    if (password !== passwordCheck) {
      set({ passwordError: "비밀번호가 일치하지 않습니다" });
    } else {
      set({ passwordError: null });
    }
  },
  setUser: (user) => set({ user }),
  setError: (error) => set({ error })
}));
