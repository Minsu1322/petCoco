import { Tables } from "../supabase";

export type MatePostType = Tables<"matePosts"> & {
  users: {
    id: string;
    nickname: string;
    profile_img: string;
  }[];
};

export type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  comments: { id: string }[];
  post_imageURL: string;
  users: {
    id: string;
    nickname: string;
    profile_img: string;
  };
};

export type PostsResponse = {
  data: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type MatePostsResponse = {
  data: MatePostType[];
};

export type MatePostsAndUsersResponse = MatePostsResponse & {
  users?: {
    id: string;
    nickname: string;
    profile_img: string;
  }[];
};
