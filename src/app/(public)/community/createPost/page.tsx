"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePostStore } from "@/zustand/post";
import { createClient } from "@/supabase/client";
import Image from "next/image";

const supabase = createClient();

// 카테고리 옵션 정의
const CATEGORIES = [
  { value: "자유게시판", label: "자유게시판" },
  { value: "희귀동물", label: "희귀동물" },
  { value: "자랑하기", label: "자랑하기" },
  { value: "고민있어요", label: "고민있어요" }
];

// Zustand store에서 필요한 상태와 함수들을 가져옵니다.
const CreatePostPage = () => {
  const { title, content, category, images, setTitle, setContent, setCategory, addImage, removeImage, initPost } =
    usePostStore();
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const router = useRouter();

  useEffect(() => {
    initPost(); // 이미지 초기화
    setUploadFiles([]); // 업로드 파일 초기화
  }, []);

  // 이미지 업로드 처리 함수
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.size > 5000000) {
        alert("파일 크기가 5MB를 초과합니다!!!.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        addImage(reader.result as string); // data URL 형태로 저장
        setUploadFiles((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageRemove = (index: number) => {
    removeImage(index);
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 폼 제출 처리 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // 이미지 업로드 및 URL 저장
      const imageUrls: string[] = [];
      for (const image of uploadFiles) {
        // 0123456
        // aaa.png
        // bbb.png
        const ext = image.name.substring(image.name.lastIndexOf(".") + 1);
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("post_image").upload(fileName, image);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("post_image").getPublicUrl(fileName);
        imageUrls.push(urlData.publicUrl);
      }

      // arr.join(',') : [aaa.png, bbb.png, ccc.png] -> "aaa.png,bbb.png,ccc.png"
      // arr.split(',') : "aaa.png,bbb.png,ccc.png" -> [aaa.png, bbb.png, ccc.png]
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .insert({
          user_id: "4ee5538f-4e1c-4ffc-83eb-a7d43e63ad8d", // 실제 사용자 ID로 교체 필요
          title,
          content,
          category,
          post_imageURL: imageUrls.join(",")
        })
        .select("*");

      console.log("게시글이 성공적으로 저장되었습니다.");
      router.push("/community");
    } catch (error) {
      console.error("게시글 저장 중 오류 발생:", error);
      alert("게시글 저장에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">글 작성하기</h1>
      {/* 카테고리 선택 UI */}
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
      {/* 제목 입력 필드 */}
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
      {/* 내용 입력 필드 */}
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
      {/* 이미지 업로드 UI */}
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
      {/* 제출 버튼 */}
      <button
        type="submit"
        className="mb-4 w-full rounded bg-blue-500 p-2 font-semibold text-white transition-colors hover:bg-blue-600"
      >
        작성완료
      </button>
      {/* 뒤로가기 링크 */}
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
