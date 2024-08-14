"use client";

import { useQuery } from "@tanstack/react-query";
import DetailMatePost from "../_components/detailMatePost";

const MatePost = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const {
    data: post,
    isPending,
    error
  } = useQuery({
    queryKey: ["matePosts", id],
    queryFn: async () => {
      const response = await fetch(`/api/mate/post/${id}`);
      const data = response.json();
      //  console.log(data);
      return data;
    }
  });

  //console.log(post);

  if (!post) return;

  if (isPending) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="max-w-[420px] mx-auto">
      <DetailMatePost post={post} />
    </div>
  );
};

export default MatePost;
