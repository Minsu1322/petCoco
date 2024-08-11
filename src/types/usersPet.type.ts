import { Tables } from "./supabase";
export type UsersPetType = Tables<"usersPet">;
export type UserType = Tables<"users">;

export type UserPetWithUsersType = UsersPetType & {
  users: UserType
}