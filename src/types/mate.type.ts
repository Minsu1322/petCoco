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
  }
}

export type MateCommentType = Tables<"mateComments">;

