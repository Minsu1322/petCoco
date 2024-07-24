"use client";

import { useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { locationStore } from "@/zustand/locationStore";
import { useRouter } from "next/navigation";
import { MateNextPostType } from "@/types/mate.type";
import Link from "next/link";
import { getConvertAddress } from "../getConvertAddress";

// 동적 로딩 설정
const DynamicMapComponent = dynamic(() => import("@/app/(public)/mate/_components/mapForm"), { ssr: false });

// TODO:타입 밖으로 빼기
// export type PostType = {
//   title: string;
//   content: string;
//   position: {
//     center: {
//       lat: number;
//       lng: number;
//     };
//     errMsg: string | null;
//     isLoading: boolean;
//   };
//   dateTime: string;
//   numbers: string;
//   neutered: null | boolean;
//   male_female: string;
//   members: string;
//   size: string;
//   weight: string;
//   recruiting: boolean;
//   characteristics: string;
// };

// interface NextPost {
//   title: string;
//   content: string;
//   position: {
//     lat: number;
//     lng: number;
//   }
// }

// interface PostFormProps {
//   isEditing?: boolean;
//   dbPosition?: { lat: number; lng: number };
// }

const PostForm = () => {
  // TODO: state 하나로 관리하도록 변경하기
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const { position, setPosition } = locationStore();
  const [dateTime, setDateTime] = useState<string>("");
  const [male_female, setMale_female] = useState<string>("");
  const [neutered, setNeutered] = useState<boolean | null>(null);
  const [numbers, setNumbers] = useState<string>("");
  const [members, setMembers] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [characteristics, setCharacteristics] = useState<string>("");
  // const [petsAge, setPetsAge] = useState<string>("");
  // const [mateAge, setMateAge] = useState<string>("");
  // const [mateGender, setMateGender] = useState<string>("");
  // const [mateType, setMateType] = useState<string>("");
  // const [mateInfo, setMateInfo] = useState<string>("");

  const queryClient = useQueryClient();
  const router = useRouter();

  const addPost = async (nextPost: MateNextPostType) => {
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

  const {
    data: addressData,
    isPending,
    error
  } = useQuery({
    queryKey: ["address", position.center],
    queryFn: async () => {
      const response = await getConvertAddress(position.center);
      return response;
    },
    enabled: !!position.center
  });
  const address =
    (addressData && addressData?.documents[0]?.road_address?.address_name) ||
    addressData?.documents[0]?.address?.address_name ||
    "주소 정보를 찾을 수 없어요";

  console.log("주소 변환 데이터 확인", addressData);

  const addMutation = useMutation({
    mutationFn: async (nextPost: MateNextPostType) => await addPost(nextPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
      alert("등록되었습니다!");
    }
  });

  const nextPost: MateNextPostType = {
    title,
    content,
    position,
    dateTime,
    numbers,
    neutered,
    male_female,
    members,
    size,
    weight,
    recruiting: true,
    characteristics
    // address
    // place
    // petsAge,
    // mateAge,
    // mateGender,
    // mateType,
    // mateInfo
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
      setPosition({ center: { lat: 37.5556236021213, lng: 126.992199507869 }, errMsg: null, isLoading: true });
      setNumbers("0");
      setNeutered(null);
      setMale_female("");
      setSize("");
      setWeight("");
      setMembers("");
      setSize("");
      setWeight("");
      setCharacteristics("");
      // setPetsAge('');
      // setMateAge('');
      // setMateGender('');
      // setMateType('');
      // setMateInfo('');

      router.replace("/mate");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Link href="/mate">
        <div
          className="mt-3 flex h-10 w-20 cursor-pointer items-center justify-center rounded-md bg-mainColor p-1"
          onClick={() =>
            setPosition({ center: { lat: 37.5556236021213, lng: 126.992199507869 }, errMsg: null, isLoading: true })
          }
        >
          뒤로가기
        </div>
      </Link>
      <h1>산책 메이트 구하기 🐾</h1>
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
            <DynamicMapComponent center={{ lat: 37.5556236021213, lng: 126.992199507869 }} />
            <p>클릭한 곳의 주소는 ? {address} </p>
          </div>
          <div className="flex flex-row gap-x-4">
            <label htmlFor="dateTime">산책 날짜 및 시간</label>
            <input type="datetime-local" id="dateTime" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
          </div>
          <div className="flex flex-row gap-x-2">
            <p>모집인원 수 : </p>
            <input type="text" className="border" value={members} onChange={(e) => setMembers(e.target.value)} />명
          </div>

          <div className="mt-3 flex flex-col gap-x-5">
            <p>🐶 반려동물 정보</p>
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
              <input
                type="checkbox"
                name="male_female"
                value="female"
                onChange={(e) => setMale_female(e.target.value)}
              />
              <label htmlFor="male_female">암컷</label>
              <input type="checkbox" name="male_female" value="male" onChange={(e) => setMale_female(e.target.value)} />
              <label htmlFor="male_female">수컷</label>
            </div>
            <div className="flex flex-row gap-x-3">
              <p>중성화 여부 : </p>
              <input type="checkbox" name="neutered" value="true" onChange={() => setNeutered(true)} />
              <label>네</label>
              <input type="checkbox" name="neutered" value="false" onChange={() => setNeutered(false)} />
              <label>아니오</label>
            </div>
            {/* <div className="flex flex-row gap-x-2">
              <p>나이 : </p>
              <input type="text" className="border" value={petsAge} onChange={(e) => setPetsAge(e.target.value)} />명
            </div> */}
            <div className="flex flex-row gap-x-2">
              <p>크기 : </p>
              {/* TODO: 적당한 이름 찾기,, */}
              <input
                type="checkbox"
                name="size"
                value="소형견"
                onChange={(e) => setSize(e.target.checked ? e.target.value : "")}
              />
              <label htmlFor="size">소형견</label>
              <input
                type="checkbox"
                name="size"
                value="중형견"
                onChange={(e) => setSize(e.target.checked ? e.target.value : "")}
              />
              <label htmlFor="size">중형견</label>
              <input
                type="checkbox"
                name="size"
                value="대형견"
                onChange={(e) => setSize(e.target.checked ? e.target.value : "")}
              />
              <label htmlFor="size">대형견</label>
            </div>
            <div className="flex flex-row gap-x-2">
              <p>무게 : </p>
              <input type="text" className="border" value={weight} onChange={(e) => setWeight(e.target.value)} /> kg
            </div>
            <div className="flex flex-row gap-x-2">
              <p>성격 및 특징 : </p>
              <select
                name="number of animals"
                id="number"
                className="w-16 border border-black"
                value={characteristics}
                onChange={(e) => setCharacteristics(e.target.value)}
              >
                <option value="온순함">온순함</option>
                <option value="활발함">활발함</option>
                <option value="소심함">소심함</option>
                <option value="적극적">적극적</option>
                <option value="외향적">외향적</option>
                <option value="내향적">내향적</option>
                <option value="낯가림">낯가림</option>
              </select>
            </div>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              placeholder=" 글을 작성해 주세요."
              className="mt-5 h-full w-[500px] resize-none rounded-md border border-gray-300 p-1"
            ></textarea>
            <p className="mt-1">🐾 반려동물이 2마리 이상인 경우 본문에 추가로 정보를 기재해 주세요.</p>
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
