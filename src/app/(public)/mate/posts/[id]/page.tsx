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
      //  console.log(data);
      return data;
    }
  });
  if (!post) return;
  if (isPending) {
      <div className="flex items-center justify-center w-full h-full mt-[30%]">
        <LoadingComponent />
      </div>
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
