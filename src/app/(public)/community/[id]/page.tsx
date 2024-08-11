"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import Comments from "../_components/comments";
import Swal from "sweetalert2";

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

  // 이 페이지에서 수정페이지(createPost)로 유저를 이동시킴
  const handleEdit = () => {
    router.push(`/community/createPost/?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "게시물 삭제",
      text: "정말로 이 게시물을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#c0c0c0",
      confirmButtonText: "삭제",
      cancelButtonText: "취소"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/detailCommunity/${id}`, {
            method: "DELETE"
          });

          if (response.ok) {
            Swal.fire({
              title: "완료!",
              text: "게시물이 삭제되었습니다",
              icon: "success"
            }).then(() => {
              router.replace("/community");
            });
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "오류가 발생했습니다!",
            text: "게시물 삭제 중 오류가 발생했습니다.",
            icon: "error"
          }).then(() => {
            router.replace("/community");
          });
        }
      }
    });
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  if (!user) {
    // alert("로그인이 필요한 서비스입니다.");
    Swal.fire({
      title: "로그인이 필요합니다!",
      text: "커뮤니티 상세 페이지를 확인하기 위해서는 로그인이 필요합니다",
      icon: "warning"
    });
    router.push("/signin");
    return null;
  }

  return (
    <div className="mx-auto mb-5 mt-8 max-w-5xl rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div className="mb-1 flex justify-between">
        <div className="mb-4 flex justify-start">
          {post.category.split(",").map((category) => (
            <span key={category} className="mr-2 rounded-full bg-gray-300 px-2 py-1 text-sm text-white">
              {category}
            </span>
          ))}
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
      </div>

      <div className="mb-10 flex">
        {
          <Image
            src={
              post.users.profile_img ||
              "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/post_image/1722324396777_xo2ka9.jpg"
            }
            alt={post.users.nickname}
            width={74}
            height={74}
            className="rounded-full border border-[#e6efff]"
          />
        }
        <div className="ml-3 flex flex-col justify-center">
          <div className="flex font-semibold">
            {/* <p className="mr-2 font-semibold">작성자:</p> */}
            {post.users.nickname}
          </div>
          <div className="flex text-gray-400">
            {/* <p className="mr-2 font-semibold">작성일:</p> */}
            {new Date(post.created_at).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-md bg-[#f7faff] p-1">
        <h1 className="text-xl font-bold">{post.title}</h1>
      </div>

      <div className="prose max-w-none whitespace-pre-wrap rounded-md bg-[#f7faff] p-4">
        <p>{post.content}</p>
      </div>
      {post?.post_imageURL && (
        <div className="mt-4 flex overflow-x-auto rounded-md">
          {post.post_imageURL.split(",").map((img, index) => (
            <div key={index} style={{ position: "relative", width: "220px", height: "220px" }} className="rounded-md">
              <Image
                key={index}
                src={img}
                alt={`${post.title} - 이미지 ${index + 1}`}
                sizes="100vw"
                fill
                style={{
                  objectFit: "cover"
                }}
                className={`rounded ${index === 0 ? "" : "ml-2"} rounded-md border border-[#e6efff]`}
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
