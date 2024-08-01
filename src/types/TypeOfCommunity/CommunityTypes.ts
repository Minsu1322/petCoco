export type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  users: {
    id: string;
    nickname: string;
  };
};
export type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  comments: string | null;
  users: {
    id: string;
    nickname: string;
  };
};

export type PostsResponse = {
  data: Post[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
