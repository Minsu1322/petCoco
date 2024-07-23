import { create } from "zustand";
import { supabase } from "@/supabase/userClient";
import { UserInfoType } from "@/types/auth.type";

interface useAuth {
  user: any;
  error: string | null;
  passwordError: string | null;
  passwordValidateError: string | null;
  emailError: string | null;
  signUp: (credentials: Omit<UserInfoType, "created_at" | "id" | "profile_img" | "passwordCheck">) => Promise<void>;
  signIn: (credentials: Pick<UserInfoType, "email" | "password">) => Promise<void>;
  signOut: () => Promise<void>;
  emailCheck: (email: string) => Promise<void>;
  validatePasswords: (password: string, passwordCheck: string) => void;
  validationPasswds: (password: string) => void;
  setUser: (user: any) => void;
  setError: (error: string | null) => void;
  signInWithGoogle: () => Promise<void>;
}

export const useAuthStore = create<useAuth>((set) => ({
  user: null,
  error: null,
  passwordError: null,
  passwordValidateError: null,
  emailError: null,
  emailCheck: async (email) => {
    try {
      const { data: existingUsers, error: checkError } = await supabase.from("users").select("*").eq("email", email);
      if (checkError) {
        throw new Error()
      }

      if (existingUsers.length > 0) {
        set({emailError: "중복된 이메일입니다."});
      } else {
        set({emailError: null});
      }
    } catch (error: any) {
      console.error("이메일 체크 에러", error.message);
      set({ emailError: error.message });
    }
  },
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
      set({ error: null });
    } catch (error: any) {
      console.error("회원가입 에러", error.message);
      set({ error: error.message })
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
  signOut: async () => {
    try {
      const {error} = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      set({user: null, error: null});
    } catch (error: any) {
      console.error("로그아웃 에러", error.message);
      set({error: error.message});
    }
  },
  validatePasswords: (password, passwordCheck) => {
    const passwordRequirements = [
      {}
    ]

    if (password !== passwordCheck) {
      set({ passwordError: "비밀번호가 일치하지 않습니다" });
    } else {
      set({ passwordError: null });
    }
  },
  validationPasswds: (password) => {
    const minLength = 8;
    const maxLength = 20;
    const hasLowerCase =  /[a-z]/.test(password);
    const hasNumber =  /[0-9]/.test(password);
    const hasSpecialChar =  /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
      password.length < minLength ||
      password.length > maxLength ||
      !hasLowerCase ||
      !hasNumber ||
      !hasSpecialChar
    ) {
      set({ passwordValidateError: "영문, 숫자, 특수문자 조합 8-20자" })
    } else {
      set({ passwordValidateError: null });
    }
  },
  signInWithGoogle: async () => {
    try {
      const {data, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        throw new Error(error.message);
      }

      window.location.href = data.url;
    } catch (error: any) {
      console.error("구글 로그인 에러", error.message);
      set({error: error.message});
    }
  },
  setUser: (user) => set({ user }),
  setError: (error) => set({ error })
}));
