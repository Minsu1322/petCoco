import Comments from "@/components/community/[id]/Comment";
import React from "react";
import Image from "next/image";

interface PageProps {
  params: { id: string };
}

interface Post {
  id: string;
  category: string;
  title: string;
  content: string;
  created_at: string;
  users: {
    nickname: string;
    profile_img: string;
  };
  post_imageURL: string; //이미지1, 이미지2, 이미지3
  // 필요한 다른 필드들을 여기에 추가하세요
}

const fetchPost = async (postId: string): Promise<Post> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/detailCommunity?id=${postId}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data[0]; // API가 배열을 반환하므로 첫 번째 항목을 가져옵니다
};

const CommunityMain: React.FC<PageProps> = async ({ params }) => {
  const { id } = params;
  const post = await fetchPost(id);

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex justify-start">
        {post.category.split(",").map((category) => (
          <span key={category} className="mr-2 rounded-full bg-gray-300 px-2 py-1 text-sm text-white">
            {category}
          </span>
        ))}
      </div>
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      <div className="mb-4 flex">
        <Image src={post.users.profile_img} alt={post.users.nickname} width={74} height={74} className="rounded-full" />
        <div className="ml-2 flex flex-col justify-center">
          <p className="text-gray-600">작성자: {post.users.nickname}</p>
          <p className="text-gray-600">작성일: {new Date(post.created_at).toLocaleString()}</p>
        </div>
      </div>
      <div className="prose max-w-none">
        <p>{post.content}</p>
      </div>
      <div className="mt-4 flex max-w-2xl overflow-x-auto rounded-lg">
        {post.post_imageURL.split(",").map((img, index) => (
          <Image
            src={img}
            alt={post.title}
            width={0}
            height={0}
            sizes="100vw"
            className={`rounded ${index === 0 ? "" : "ml-2"}`}
            style={{ width: "80%", height: "auto" }}
          />
        ))}
      </div>
      <hr className="my-8" />
      <h2 className="mb-4 text-2xl font-semibold">댓글</h2>
      <Comments postId={id} />
    </div>
  );
};

export default CommunityMain;
