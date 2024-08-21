import { Tables } from "./supabase";
export type UserType = Tables<"users">;

export type UsersPetType = Tables<"usersPet">;

export type UserInfoType = UserType & {
  password: string;
  passwordCheck: string;
};
