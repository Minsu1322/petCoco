"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { usePostStore } from "@/zustand/post";
import { createClient } from "@/supabase/client";
import Image from "next/image";
import { useAuthStore } from "@/zustand/useAuth";
import { tabs, tags } from "@/components/community/communityTabAndSortTab/TabAndCategory";
import { NextRequest } from "next/server";
const supabase = createClient();
const CATEGORIES = tabs.filter((tab) => tab !== "전체" && tab !== "인기글").map((tab) => ({ value: tab, label: tab })); // "전체"와 "인기글" 제외
const CATEGORIESANIMAL = tags
  .filter((tab) => tab !== "전체" && tab !== "인기글")
  .map((tab) => ({ value: tab, label: tab }));
// Zustand store에서 필요한 상태와 함수들을 가져옵니다.
const CreatePostPage = () => {
  const { title, content, category, images, setTitle, setContent, setCategory, addImage, removeImage, initPost } =
    usePostStore();
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [deleteFiles, setDeleteFiles] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const { user } = useAuthStore();
  // const user_id = user && user.id;
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
        //supabase에서 이미지 URL을 가져와서 이미지로 변환
        if (!ignore) {
          //useEffect가 두번 실행되는것을 방지
          initPost(); // Zustand 초기화 함수 호출
          setTitle(postData?.title || "");
          setContent(postData?.content || "");
          setCategory(postData?.category || "");
          setUploadFiles([]); // 업로드 파일 초기화
          await fetchPostImages(postData as { post_imageURL: string });
        }
      } else {
        initPost(); // 이미지 초기화
        setUploadFiles([]); // 업로드 파일 초기화
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
      const existingUrls = new Set(uploadFiles.map((file) => file.name)); // 이미 업로드된 이미지 이름 추적
      for (const url of urls) {
        if (!existingUrls.has(url)) {
          // 중복된 이미지 URL이 아닌 경우에만 처리
          // 이미지 URL을 data url 형태로 변환
          const xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "blob";
          xhr.onload = function () {
            const reader = new FileReader();
            reader.onload = function () {
              const dataUrl = reader.result as string;
              if (!uploadFiles.some((file) => file.name === url)) {
                // 중복 체크
                addImage(dataUrl); // 상태에 이미지 추가
                setUploadFiles((prev) => [...prev, new File([xhr.response], url)]); // 업로드 파일 상태 업데이트
              }
            };
            reader.readAsDataURL(xhr.response);
          };
          xhr.send();
        }
      }
    }
  };
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
  const handleImageRemove = async (index: number) => {
    const imageLocationArray = uploadFiles[index].name.split("/storage/v1/object/public/post_image/");
    if (imageLocationArray.length > 1) {
      const imageLocation = imageLocationArray[1];
      setDeleteFiles((prev) => [...prev, imageLocation]);
    }
    removeImage(index);
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };
  // 폼 제출 처리 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 이미지 업로드 및 URL 저장
      const imageUrls: string[] = [];
      for (const deleteImage of deleteFiles) {
        const { error: deleteError } = await supabase.storage.from("post_image").remove([deleteImage]);
        if (deleteError) throw deleteError;
      }
      for (const image of uploadFiles) {
        // 0123456
        // aaa.png
        // bbb.png
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
      // arr.join(',') : [aaa.png, bbb.png, ccc.png] -> "aaa.png,bbb.png,ccc.png"
      // arr.split(',') : "aaa.png,bbb.png,ccc.png" -> [aaa.png, bbb.png, ccc.png]
      // useEffect(() => {
      //   if (data?.fetchBoard.images?.length) {
      //     setImgUrl([...data?.fetchBoard.images]);
      //   }
      // }, [data]);
      // 게시글 수정이라면 업데이트, 아니라면 새로 생성
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
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl p-4">
      <h1 className="my-10 text-center text-2xl font-bold">글 작성하기</h1>
      {/* 카테고리 선택 UI */}
      <div className="mb-4 flex">
        <label htmlFor="category" className="mr-5 block w-[140px] py-2 font-semibold">
          카테고리 선택
        </label>
        <div id="category" className="flex flex-row flex-wrap">
          {CATEGORIES.map((cat) => (
            <div key={cat.value} className="mb-2 mr-2">
              <button
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`rounded-full border px-4 py-2 ${category === cat.value ? "bg-gray-300" : "hover:bg-gray-200"}`}
              >
                {cat.label}
              </button>
            </div>
          ))}
          {CATEGORIESANIMAL.map((cat) => (
            <div key={cat.value} className="mb-2 mr-2">
              <button
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`rounded-full border px-4 py-2 ${category === cat.value ? "bg-gray-300" : "hover:bg-gray-200"}`}
              >
                {cat.label}
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* 제목 입력 필드 */}
      <div className="mb-4 flex">
        <label htmlFor="title" className="mr-5 block w-[140px] font-semibold">
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
      <div className="mb-4 flex">
        <label htmlFor="content" className="mr-5 block w-[140px] font-semibold">
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
        <div className="mt-2 flex flex-nowrap gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={image}
                alt={`attachment-${index}`}
                width={220}
                height={220}
                className={`rounded object-cover ${index === 0 ? "border-4 border-blue-500" : ""}`}
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
      <div className="flex justify-end">
        {/* 뒤로가기 링크 */}
        <Link
          href="/community"
          className="mr-4 block w-[140px] rounded bg-gray-500 p-3 text-center font-semibold text-white transition-colors hover:bg-gray-600"
        >
          취소
        </Link>
        {/* 제출 버튼 */}
        <button
          type="submit"
          className="block w-[140px] rounded bg-blue-500 p-3 font-semibold text-white transition-colors hover:bg-blue-600"
        >
          {postId ? "수정" : "작성"}하기
        </button>
      </div>
    </form>
  );
};
export default CreatePostPage;