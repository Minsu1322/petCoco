"use client";

import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useLocation } from "@/zustand/useLocation";

// 동적 로딩 설정
const DynamicMapComponent = dynamic(() => import("@/app/(public)/mate/_components/mapForm"), { ssr: false });

// TODO:타입 밖으로 빼기
export type PostType = {
  title: string;
  content: string;
  position: {
    lat: number;
    lng: number;
  };
  number: string;
  neutered: boolean;
  male_female: string;
};

// interface NextPost {
//   title: string;
//   content: string;
//   position: {
//     lat: number;
//     lng: number;
//   }
// }

const PostForm = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const { position, setPosition } = useLocation();
  const [male_female, setMale_female] = useState<string>("");
  const [neutered, setNeutered] = useState<boolean>(true);
  const [number, setNumber] = useState<string>("");

  const queryClient = useQueryClient();

  const addPost = async (nextPost: PostType) => {
    try {
      const response = await fetch(`/api/mate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nextPost)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      //console.log("Response data:", data);

      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const addMutation = useMutation({
    mutationFn: async (nextPost: PostType) => await addPost(nextPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
    }
  });

  const nextPost: PostType = {
    title,
    content,
    position,
    number,
    neutered,
    male_female
  };

  const handleUploadPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !content) {
      alert("제목과 내용을 모두 입력해 주세요!");
      return;
    }

    try {
      addMutation.mutate(nextPost);
      setTitle("");
      setContent("");
      setPosition({ lat: 37.5556236021213, lng: 126.992199507869 });
      setNumber("");
      setNeutered(true);
      setMale_female("");
    } catch (err) {
      console.error(err);
    }
  };
  console.log(nextPost);

  return (
    <div>
      <div>글 작성</div>
      <form onSubmit={handleUploadPost} className="flex flex-col">
        <div className="flex flex-col">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder=" 제목을 입력해 주세요"
            className="w-[400px] rounded-md border border-gray-300"
          />
          <div>
            <DynamicMapComponent
              center={{ lat: 37.5556236021213, lng: 126.992199507869 }}
              // markerPosition={{ lat: 37.5556236021213, lng: 126.992199507869  }}
            />
          </div>
          <div className="mt-3 flex flex-row items-center gap-x-5">
            <div className="flex flex-row gap-x-2">
              <label htmlFor="number">반려동물 수</label>
              <select
                name="number of animals"
                id="number"
                className="w-12 border border-black"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <div className="flex flex-row gap-x-2">
              <p>성별 : </p>
              <label htmlFor="male_female">암컷</label>
              <input type="checkbox" name="male_female" value="female" onChange={(e) => setMale_female(e.target.value)} />
              <label htmlFor="male_female">수컷</label>
              <input
                type="checkbox"
                name="male_female"
                value="male"
                onChange={(e) => setMale_female(e.target.value)}
              />
            </div>
            <div>
              <p>중성화 여부 : </p>
              <label>네</label>
              <input type="radio" name="neutered" value="true" onChange={ (e) => setNeutered(e.target.value === "true")} />
      <label>아니오</label>
      <input type="radio" name="neutered" value="false" onChange={(e) => setNeutered(e.target.value === "false")} />
    </div>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            placeholder=" 글을 작성해 주세요"
            className="mt-5 h-full w-[500px] resize-none rounded-md border border-gray-300 p-1"
          ></textarea>
        </div>
        </div>
        <button type="submit" className="h-10 w-20 rounded-md bg-blue-500 p-1 text-white">
          등록하기
        </button>
      </form>
    </div>
  )
  }

export default PostForm;
