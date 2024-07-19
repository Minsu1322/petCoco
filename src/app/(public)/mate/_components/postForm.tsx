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
  numbers: string;
  neutered: null | boolean;
  male_female: string;
  members: string;
  size: string;
  weight: string;
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
  // TODO: state 하나로 관리하도록 변경하기
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const { position, setPosition } = useLocation();
  const [male_female, setMale_female] = useState<string>("");
  const [neutered, setNeutered] = useState<boolean | null>(null);
  const [numbers, setNumbers] = useState<string>("");
  const [members, setMembers] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

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
    numbers,
    neutered,
    male_female,
    members,
    size,
    weight
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
      setNumbers("0");
      setNeutered(null);
      setMale_female("");
      setSize("");
      setWeight("");
      setMembers("");
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
            className="w-[300px] rounded-md border border-gray-300"
          />
          <div>
            <DynamicMapComponent
              center={{ lat: 37.5556236021213, lng: 126.992199507869 }}
              // markerPosition={{ lat: 37.5556236021213, lng: 126.992199507869  }}
            />
          </div>
          <div className="mt-3 flex flex-col gap-x-5">
            <div className="flex flex-row gap-x-2">
              <label htmlFor="number">반려동물 수</label>
              <select
                name="number of animals"
                id="number"
                className="w-12 border border-black"
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
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
              <input
                type="checkbox"
                name="male_female"
                value="female"
                checked={male_female === "female"}
                onChange={(e) => setMale_female(e.target.value)}
              />
              <label htmlFor="male_female">수컷</label>
              <input
                type="checkbox"
                name="male_female"
                value="male"
                checked={male_female === "male"}
                onChange={(e) => setMale_female(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-x-3">
              <p>중성화 여부 : </p>
              <label>네</label>
              <input
                type="radio"
                name="neutered"
                value="true"
                onChange={() => setNeutered(true)}
                checked={neutered === true}
              />
              <label>아니오</label>
              <input
                type="radio"
                name="neutered"
                value="false"
                onChange={() => setNeutered(false)}
                checked={neutered === false}
              />
            </div>
            <div className="flex flex-row gap-x-2">
              <p> 견종 크기 : </p>
              {/* TODO: 적당한 이름 찾기,, */}
              <label htmlFor="size">소형견</label>
              <input
                type="checkbox"
                name="size"
                value="소형견"
                onChange={(e) => setSize(e.target.checked ? e.target.value : "")}
                checked={size === "소형견"}
              />
              <label htmlFor="male_female">중형견</label>
              <input
                type="checkbox"
                name="size"
                value="중형견"
                onChange={(e) => setSize(e.target.checked ? e.target.value : "")}
                checked={size === "중형견"}
              />
              <label htmlFor="male_female">대형견</label>
              <input
                type="checkbox"
                name="size"
                value="대형견"
                onChange={(e) => setSize(e.target.checked ? e.target.value : "")}
                checked={size === "대형견"}
              />
            </div>
            <div className="flex flex-row gap-x-2">
              <p>무게 : </p>
              <input type="text" className="border" value={weight} onChange={(e) => setWeight(e.target.value)} /> kg
            </div>
            <div className="flex flex-row gap-x-2">
              <p>모집인원 수 : </p>
              <input type="text" className="border" value={members} onChange={(e) => setMembers(e.target.value)} />명
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
        <button type="submit" className="mt-3 h-10 w-20 rounded-md bg-mainColor p-1">
          등록하기
        </button>
      </form>
    </div>
  );
};

export default PostForm;
