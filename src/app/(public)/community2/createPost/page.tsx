"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { usePostStore } from "@/zustand/post";
import { createClient } from "@/supabase/client";
import Image from "next/image";
import { useAuthStore } from "@/zustand/useAuth";
import { tabs } from "@/components/community/communityTabAndSortTab/TabAndCategory";
import { Input, Textarea, Button } from "@nextui-org/react";
import Swal from "sweetalert2";

const supabase = createClient();

const CATEGORIES = tabs.filter((tab) => tab !== "전체").map((tab) => ({ value: tab, label: tab })); // "전체"제외

// Zustand store에서 필요한 상태와 함수들을 가져옵니다.
const CreatePostPage = () => {
  const { title, content, category, images, setTitle, setContent, setCategory, addImage, removeImage, initPost } =
    usePostStore();
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [deleteFiles, setDeleteFiles] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  //게시글 수정페이지(createPost)로 이동해서 id값을 가져와서 postId에 저장
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
        if (uploadFiles.length >= 3) {
          console.warn("이미지는 최대 3개까지만 업로드 가능합니다.");
          break;
        }
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
    if (uploadFiles.length + files.length > 3) {
      Swal.fire({
        title: "주의!",
        text: "이미지는 최대 3개까지만 업로드 가능합니다.",
        icon: "warning"
      });
      return;
    }

    files.forEach((file) => {
      if (file.size > 5000000) {
        Swal.fire({
          title: "주의!",
          text: "파일 크기가 5MB를 초과합니다!!!",
          icon: "warning"
        });

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
      // console.log("게시글이 성공적으로 저장되었습니다.");
      Swal.fire({
        title: "완료!",
        text: "게시글이 성공적으로 저장되었습니다.",
        icon: "success"
      });

      router.push(postId ? `/community2/${postId}` : "/community2");
    } catch (error) {
      console.error("게시글 처리 중 오류가 발생했습니다:", error);
      // alert("게시글 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
      Swal.fire({
        title: "오류가 발생했습니다!",
        text: "게시글 처리 중 오류가 발생했습니다. 다시 시도해 주세요.",
        icon: "error"
      });
    }
  };

  if (!user) {
    // alert("로그인이 필요한 서비스입니다.");
    Swal.fire({
      title: "로그인이 필요합니다!",
      text: "커뮤니트 글쓰기를 위해서는 로그인이 필요합니다",
      icon: "warning"
    });
    router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/signin`);
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto h-full w-[375px] bg-white px-[1.5rem]">
      <h2 className="mb-4 mt-[2rem] text-[2rem] font-semibold">{postId ? "글 수정" : "글 작성"}하기</h2>
      <div className="mb-4 text-[1rem]">
        서로를 존중하는 말로 건강한 반려인 커뮤니티를 <br />
        만들어가요.
      </div>
      {/* 카테고리 선택 UI */}
      <div className="">
        <label htmlFor="category" className="text-[1rem] font-semibold">
          카테고리 선택
        </label>
        <div id="category" className="flex w-full gap-[0.62rem] py-[0.62rem]">
          {CATEGORIES.map((cat) => (
            <div key={cat.value} className="">
              <button
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`rounded-full border px-[0.75rem] py-[0.5rem] text-[0.89rem] ${category === cat.value ? "bg-mainColor text-white" : "border border-mainColor text-mainColor"}`}
              >
                {cat.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 제목 입력 필드 */}
      <div className="flex flex-col">
        <label htmlFor="title" className="mb-[0.5rem] text-[1rem] font-semibold">
          제목
        </label> 
        <div className="rounded-[0.5rem] border border-mainColor p-[0.75rem]">
          <input
            placeholder="제목을 입력해주세요."
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-full w-full focus:outline-none"
          />
        </div>
      </div>
      {/* 내용 입력 필드 */}
      <div className="mt-[1rem]">
        <label htmlFor="content" className="text-[1rem] font-semibold">
          내용
        </label>
        <div className="mb-[1.5rem] mt-[0.5rem] rounded-[0.5rem] border border-mainColor p-[0.75rem]">
          <textarea
            id="content"
            value={content}
            placeholder="내용을 입력해주세요."
            onChange={(e) => setContent(e.target.value)}
            className="h-[15rem] w-full focus:outline-none"
            required
          />
        </div>
      </div>
      {/* 이미지 업로드 UI */}
      <div className="">
        <p className="mb-[0.75rem]">이미지 첨부 (최대 세 장만 첨부할 수 있어요)</p>
        <label htmlFor="images" className="inline-block">
          <div className="flex items-center gap-[0.5rem] rounded-[0.5rem] border border-mainColor p-[0.5rem] text-mainColor">
            <p className="text-[0.875rem] font-semibold">파일 선택</p>
            <img src="/assets/svg/file.svg" alt="imageIcon" />
          </div>
        </label>
        <input
          type="file"
          id="images"
          multiple
          onChange={handleImageUpload}
          className="absolute h-0 w-0 overflow-hidden border border-none p-0"
        />
        <div className="mt-2 flex flex-nowrap gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative h-[6.25rem] w-[6.25rem] shrink">
              <Image
                src={image}
                alt={`attachment-${index}`}
                width={220}
                height={220}
                className={`h-full w-full rounded object-cover ${index === 0 ? "border-4 border-blue-500" : ""}`}
              />
              {index === 0 && (
                <span className="absolute left-0 top-0 rounded-br bg-blue-500 px-2 py-1 text-xs text-white">
                  대표 이미지
                </span>
              )}
              <button
                type="button"
                onClick={() => handleImageRemove(index)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-[0.4rem] bg-gray-400 opacity-75"
              >
                <img src="/assets/svg/xIcon.svg" alt="..." />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-20">
        {/* 뒤로가기 링크 */}
        {/* <Link href="/community" className="">
          취소
        </Link> */}
        {/* 제출 버튼 */}
        <button
          type="submit"
          className="mt-[1.5rem] flex w-full justify-center rounded-full border bg-mainColor px-[1.5rem] py-[0.75rem] text-[1rem] font-bold text-white"
        >
          {postId ? "수정" : "작성"} 완료
        </button>
      </div>
    </form>
  );
};
export default CreatePostPage;
