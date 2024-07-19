import Comments from "@/components/community/[id]/Comment";
import React from "react";

interface PageProps {
  params: { id: string };
}

const CommunityMain: React.FC<PageProps> = ({ params }) => {
  const { id } = params;

  return (
    <div>
      <h1>------------------포스팅 내용 ---------------</h1>
      <Comments postId={id} />
    </div>
  );
};

export default CommunityMain;
