import { Tables } from "./supabase";
export type UserType = Tables<"users">;

export type UserInfoType = UserType & {
  password: string;
  passwordCheck: string;
};
