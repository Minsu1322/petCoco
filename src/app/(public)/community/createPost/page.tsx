"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePostStore } from "@/zustand/post";
import { createClient } from "@/supabase/client";
import Image from "next/image";
import { useAuthStore } from "@/zustand/useAuth";
import { tabs } from "@/components/community/communityTabAndSortTab/TabAndCategory";

const supabase = createClient();

const CATEGORIES = tabs.filter((tab) => tab !== "전체" && tab !== "인기글").map((tab) => ({ value: tab, label: tab }));

const CreatePostPage = () => {
  const { title, content, category, images, setTitle, setContent, setCategory, addImage, removeImage, initPost } =
    usePostStore();
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [deleteFiles, setDeleteFiles] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const { user } = useAuthStore();

  useEffect(() => {
    let ignore = false;

    const fetchPost = async (postId: string | null) => {
      if (postId) {
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select(`*, users (*)`)
          .eq("id", postId)
          .single();

        if (postError) {
          console.error("게시글을 불러오는 중 오류가 발생했습니다:", postError);
          return;
        }

        if (!ignore) {
          initPost();
          setTitle(postData?.title || "");
          setContent(postData?.content || "");
          setCategory(postData?.category || "");

          setUploadFiles([]);
          await fetchPostImages(postData as { post_imageURL: string });
        }
      } else {
        initPost(); // 새 게시글 작성 시 상태 초기화
        setUploadFiles([]);
      }
    };

    fetchPost(postId);

    return () => {
      ignore = true;
    };
  }, [postId, initPost, setTitle, setContent, setCategory]);

  const fetchPostImages = async (postData: { post_imageURL: string }) => {
    if (postData?.post_imageURL) {
      const urls = postData.post_imageURL.split(",");
      const existingUrls = new Set(uploadFiles.map((file) => file.name));

      for (const url of urls) {
        if (!existingUrls.has(url)) {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "blob";
          xhr.onload = function () {
            const reader = new FileReader();
            reader.onload = function () {
              const dataUrl = reader.result as string;
              if (!uploadFiles.some((file) => file.name === url)) {
                addImage(dataUrl);
                setUploadFiles((prev) => [...prev, new File([xhr.response], url)]);
              }
            };
            reader.readAsDataURL(xhr.response);
          };
          xhr.send();
        }
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.size > 5000000) {
        alert("파일 크기가 5MB를 초과합니다!!!.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        if (!uploadFiles.some((f) => f.name === file.name)) {
          addImage(dataUrl);
          setUploadFiles((prev) => [...prev, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageRemove = async (index: number) => {
    const imageLocationArray = uploadFiles[index].name.split("/storage/v1/object/public/post_image/");
    if (imageLocationArray.length > 1) {
      const imageLocation = imageLocationArray[1];
      setDeleteFiles((prev) => [...prev, imageLocation]);
    }
    removeImage(index);
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const imageUrls: string[] = [];
      for (const deleteImage of deleteFiles) {
        const { error: deleteError } = await supabase.storage.from("post_image").remove([deleteImage]);
        if (deleteError) throw deleteError;
      }

      for (const image of uploadFiles) {
        const imageLocationArray = image.name.split("/storage/v1/object/public/post_image/");
        if (imageLocationArray.length > 1) {
          imageUrls.push(image.name);
        } else {
          const ext = image.name.substring(image.name.lastIndexOf(".") + 1);
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
          const { error: uploadError } = await supabase.storage.from("post_image").upload(fileName, image);
          if (uploadError) throw uploadError;
          const { data: urlData } = supabase.storage.from("post_image").getPublicUrl(fileName);
          imageUrls.push(urlData.publicUrl);
        }
      }

      if (postId) {
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .update({
            title,
            content,
            category,
            post_imageURL: imageUrls.join(",")
          })
          .eq("id", postId);

        if (postError) throw postError;
      } else {
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .insert({
            user_id: user.id,
            title,
            content,
            category,
            post_imageURL: imageUrls.join(",")
          })
          .select("*");

        if (postError) throw postError;
      }

      console.log("게시글이 성공적으로 저장되었습니다.");
      router.push(postId ? `/community/${postId}` : "/community");
    } catch (error) {
      console.error("게시글 처리 중 오류가 발생했습니다:", error);
      alert("게시글 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">글 작성하기</h1>
      <div className="mb-4">
        <label htmlFor="category" className="mb-2 block font-semibold">
          카테고리 선택
        </label>
        <div id="category" className="flex w-full flex-row rounded border p-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.value} className="mr-2">
              <button
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`rounded-full px-4 py-2 ${category === cat.value ? "bg-gray-300" : "hover:bg-gray-200"}`}
              >
                {cat.label}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="title" className="mb-2 block font-semibold">
          제목
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="mb-2 block font-semibold">
          내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-40 w-full rounded border p-2"
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="images" className="mb-2 block font-semibold">
          이미지 첨부
        </label>
        <input type="file" id="images" multiple onChange={handleImageUpload} className="w-full" />
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={image}
                alt={`attachment-${index}`}
                width={96}
                height={96}
                className={`h-24 w-24 rounded object-cover ${index === 0 ? "border-4 border-blue-500" : ""}`}
              />
              {index === 0 && (
                <span className="absolute left-0 top-0 rounded-br bg-blue-500 px-2 py-1 text-xs text-white">
                  대표 이미지
                </span>
              )}
              <button
                type="button"
                onClick={() => handleImageRemove(index)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="mb-4 w-full rounded bg-blue-500 p-2 font-semibold text-white transition-colors hover:bg-blue-600"
      >
        {postId ? "수정하기" : "작성하기"}
      </button>
      <Link
        href="/community"
        className="block w-full rounded bg-gray-500 p-2 text-center font-semibold text-white transition-colors hover:bg-gray-600"
      >
        뒤로가기
      </Link>
    </form>
  );
};

export default CreatePostPage;
