import { MatePostType } from "../mate.type";

export type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  comments: { id: string }[];
  users: {
    id: string;
    nickname: string;
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
