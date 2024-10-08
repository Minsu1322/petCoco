"use client";

import { useQuery } from "@tanstack/react-query";
import DetailMatePost from "../_components/detailMatePost";
import LoadingComponent from "@/components/loadingComponents/Loading";

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

      return data;
    }
  });
  if (!post) return;
  if (isPending) {
    <div className="mt-[30%] flex h-full w-full items-center justify-center">
      <LoadingComponent />
    </div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="mx-auto max-w-[420px]">
      <DetailMatePost post={post} />
    </div>
  );
};

export default MatePost;
