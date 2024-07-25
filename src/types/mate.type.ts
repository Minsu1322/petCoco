import { Tables } from "./supabase";
export type MatePostType = Tables<"matePosts">;

export type MatePostFullType = MatePostType & {
  position: {
    center: {
      lat: number;
      lng: number;
    };
    errMsg: string | null;
    isLoading: boolean;
  };
  users: {
    nickname: string;
  }
}

export type MateNextPostType = Omit<MatePostFullType, 'user_id' | 'id' | 'created_at' | 'users'>

export type MateCommentType = Tables<"mateComments">;

