"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Comments from "../_components/comments";

interface PageProps {
  params: { id: string };
}

interface Post {
  id: string;
  user_id: string;
  category: string;
  title: string;
  content: string;
  created_at: string;
  users: {
    nickname: string;
    profile_img: string;
  };
  post_imageURL: string;
}

const fetchPost = async (postId: string): Promise<Post> => {
  // const response = await fetch(`/api/detailCommunity/${postId}/?id=${postId}`);
  const response = await fetch(`/api/detailCommunity/${postId}`);
  if (!response.ok) {
    throw new Error(`Network response was not ok.`);
  }
  const data = await response.json();
  return data[0]; // API가 배열을 반환하므로 첫 번째 항목을 가져옵니다
};

const CommunityMain: React.FC<PageProps> = ({ params }) => {
  const { id } = params;
  const [post, setPost] = useState<Post | null>(null);
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const fetchedPost = await fetchPost(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    loadPost();
  }, [id]);

  const handleEdit = () => {
    router.push(`/community/createPost/?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`/api/detailCommunity/${id}`, {
          method: "DELETE"
        });

        if (response.ok) {
          alert("삭제가 완료되었습니다.");
          router.replace("/community");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.error(err);
        alert("삭제 중 오류가 발생했습니다.");
        router.replace("/community");
      }
    }
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mx-auto mt-8 max-w-5xl rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex justify-start">
        {post.category.split(",").map((category) => (
          <span key={category} className="mr-2 rounded-full bg-gray-300 px-2 py-1 text-sm text-white">
            {category}
          </span>
        ))}
      </div>
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      <div className="mb-4 flex">
        {
          <Image
            src={
              post.users.profile_img ||
              "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/post_image/1722324396777_xo2ka9.jpg"
            }
            alt={post.users.nickname}
            width={74}
            height={74}
            className="rounded-full"
          />
        }
        <div className="ml-2 flex flex-col justify-center">
          <p className="text-gray-600">작성자: {post.users.nickname}</p>
          <p className="text-gray-600">작성일: {new Date(post.created_at).toLocaleString()}</p>
        </div>
      </div>
      {user.id === post.user_id && (
        <div className="mb-4 flex flex-row gap-x-5">
          <button
            onClick={handleEdit}
            className="flex h-8 w-16 cursor-pointer items-center justify-center rounded-md bg-editBtnColor p-2"
          >
            수정
          </button>
          <button
            onClick={() => handleDelete(id)}
            className="flex h-8 w-16 cursor-pointer items-center justify-center rounded-md bg-delBtnColor p-2"
          >
            삭제
          </button>
        </div>
      )}
      <div className="prose max-w-none">
        <p>{post.content}</p>
      </div>
      {post?.post_imageURL && (
        <div className="mt-4 flex overflow-x-auto rounded-lg">
          {post.post_imageURL.split(",").map((img, index) => (
            <div key={index} style={{ position: "relative", width: "220px", height: "220px" }}>
              <Image
                key={index}
                src={img}
                alt={`${post.title} - 이미지 ${index + 1}`}
                sizes="100vw"
                fill
                style={{
                  objectFit: "cover"
                }}
                className={`rounded ${index === 0 ? "" : "ml-2"}`}
              />
            </div>
          ))}
        </div>
      )}
      <hr className="my-8" />
      <h2 className="mb-4 text-2xl font-semibold">댓글</h2>
      {/* Comments 컴포넌트를 여기에 추가하세요 */}
      <Comments postId={post.id} />
    </div>
  );
};

export default CommunityMain;
