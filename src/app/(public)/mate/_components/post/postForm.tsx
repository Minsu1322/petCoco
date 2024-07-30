"use client";

import { useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { locationStore } from "@/zustand/locationStore";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { getConvertAddress } from "../../getConvertAddress";
import { useAuthStore } from "@/zustand/useAuth";
import { MateNextPostType, Pets } from "@/types/mate.type";
import { characteristicsArr } from "../../array";

// 동적 로딩 설정
const DynamicMapComponent = dynamic(() => import("@/app/(public)/mate/_components/map/mapForm"), { ssr: false });

const PostForm = () => {
  const { user } = useAuthStore();
  const userId: string = user && user.id;
  const queryClient = useQueryClient();
  const router = useRouter();
  const { position, setPosition } = locationStore();

  const initialState: Omit<MateNextPostType, "user_id"> = {
    title: "",
    content: "",
    position: { center: { lat: 37.5556236021213, lng: 126.992199507869 }, errMsg: null, isLoading: true },
    date_time: "",
    members: "",
    recruiting: true,
    recruitment_period: "",
    address: "",
    place_name: "",
    preferred_route: "",
    special_requirements: ""
  };

  const initialPetState: Pets = {
    male_female: "",
    neutered: null,
    weight: null,
    characteristics: "",
    age: ""
  };

  const [formPosts, setFormPosts] = useState<Omit<MateNextPostType, "user_id">>(initialState);
  const [formPets, setFormPets] = useState<Pets[]>([initialPetState]);

  //console.log(formPets);

  // 게시물 등록
  const addPost = async (formAllData: { post: MateNextPostType; pets: Pets[] }) => {
    // console.log("데이터 넘어오는 거 확인", formAllData);
    try {
      const response = await fetch(`/api/mate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          post_data: formAllData.post,
          pets_data: formAllData.pets
        })
      });

      console.log("Response status:", response.status); // 응답 상태 로그

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const addMutation = useMutation({
    mutationFn: async (formAllData: { post: MateNextPostType; pets: Pets[] }) => await addPost(formAllData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
    }
  });

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

  const roadAddress =
    (addressData && addressData?.documents[0]?.road_address?.address_name) ||
    addressData?.documents[0]?.address?.address_name ||
    "주소 정보를 찾을 수 없어요";

  const address = (addressData && addressData?.documents[0]?.address?.address_name) || "주소 정보를 찾을 수 없어요";

  const handleUploadPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { title, date_time, members, recruitment_period, place_name, preferred_route, content } = formPosts;

    if (!title || !date_time || !members || !recruitment_period || !place_name || !preferred_route || !content) {
      alert("모든 항목을 입력해 주세요!");
      return;
    }

    const formAllData = {
      post: {
        ...formPosts,
        address,
        position,
        user_id: userId
      },
      pets: formPets.map((pet) => ({
        ...pet,
        weight: pet.weight === null ? null : Number(pet.weight)
      }))
    };

    // console.log("formAllData 확인", formAllData);
    try {
      addMutation.mutate(formAllData);
      setFormPosts(initialState);
      setFormPets([initialPetState]);

      alert("등록되었습니다!");
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
            setPosition({
              center: { lat: 37.5556236021213, lng: 126.992199507869 },
              errMsg: null,
              isLoading: true
            })
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
            value={formPosts.title || ""}
            onChange={(e) => setFormPosts({ ...formPosts, title: e.target.value })}
            placeholder=" 제목을 입력해 주세요"
            className="w-[300px] rounded-md border border-gray-300"
          />
          <div>
            <DynamicMapComponent center={{ lat: 37.5556236021213, lng: 126.992199507869 }} />
            <p>클릭한 곳의 주소는? {roadAddress}</p>
          </div>
          <div className="mt-5">
            <p>🔍 메이트 모집 정보</p>
            <div className="flex flex-row gap-x-4">
              <label htmlFor="date_time">산책 날짜 및 시간</label>
              <input
                type="datetime-local"
                id="date_time"
                value={formPosts.date_time || ""}
                onChange={(e) => setFormPosts({ ...formPosts, date_time: e.target.value })}
              />
            </div>
            <div className="flex flex-row gap-x-2">
              <p>모집인원 수 :</p>
              <input
                type="text"
                className="border"
                value={formPosts.members || ""}
                onChange={(e) => setFormPosts({ ...formPosts, members: e.target.value })}
              />
              명
            </div>
            <div className="flex flex-row gap-x-2">
              <p>모집기간 :</p>
              <input
                type="datetime-local"
                id="recruitment_period"
                value={formPosts.recruitment_period || ""}
                onChange={(e) => setFormPosts({ ...formPosts, recruitment_period: e.target.value })}
              />
            </div>
            <div className="flex flex-row gap-x-2">
              <p>산책 장소</p>
              <input
                type="text"
                className="border"
                value={formPosts.place_name || ""}
                onChange={(e) => setFormPosts({ ...formPosts, place_name: e.target.value })}
              />
            </div>
            <div className="flex flex-row gap-x-2">
              <p>선호하는 산책 루트</p>
              <input
                type="text"
                className="border"
                value={formPosts.preferred_route || ""}
                onChange={(e) => setFormPosts({ ...formPosts, preferred_route: e.target.value })}
              />
            </div>
            <div className="flex flex-row gap-x-2">
              <p>특별한 요구사항</p>
              <input
                type="text"
                className="border"
                value={formPosts.special_requirements || ""}
                onChange={(e) => setFormPosts({ ...formPosts, special_requirements: e.target.value })}
              />
            </div>
            <textarea
              value={formPosts.content || ""}
              onChange={(e) => setFormPosts({ ...formPosts, content: e.target.value })}
              placeholder=" 글을 작성해 주세요."
              className="mt-1 h-full w-[500px] resize-none rounded-md border border-gray-300 p-1"
            ></textarea>
          </div>

          {/* 반려동물 정보 */}
          <div className="mt-3 flex flex-col gap-y-5">
            <p>🐶 반려동물 정보</p>
            <button
              type="button"
              className="h-10 w-36 rounded-md bg-gray-300 px-2"
              onClick={() => {
                setFormPets([
                  ...formPets,
                  {
                    male_female: "",
                    neutered: null,
                    weight: null,
                    characteristics: "",
                    age: ""
                  }
                ]);
              }}
            >
              반려동물 정보 추가
            </button>
            <div className="flex flex-row gap-x-5">
              {formPets.map((pet, index) => (
                <div key={index} className="mb-2 flex w-3/12 flex-col gap-y-2 border-gray-300 px-2 pb-2">
                  <div className="flex flex-row gap-x-2">
                    <p>성별 :</p>
                    <input
                      type="checkbox"
                      name="male_female"
                      value="female"
                      checked={pet.male_female === "female"}
                      onChange={() => {
                        const newPets = [...formPets];
                        newPets[index].male_female = newPets[index].male_female === "female" ? "" : "female";
                        setFormPets(newPets);
                      }}
                    />
                    <label>암컷</label>
                    <input
                      type="checkbox"
                      name="male_female"
                      value="male"
                      checked={pet.male_female === "male"}
                      onChange={() => {
                        const newPets = [...formPets];
                        newPets[index].male_female = newPets[index].male_female === "male" ? "" : "male";
                        setFormPets(newPets);
                      }}
                    />
                    <label>수컷</label>
                  </div>
                  <div className="flex flex-row gap-x-3">
                    <p>중성화 여부 :</p>
                    <input
                      type="checkbox"
                      name="neutered"
                      checked={pet.neutered === true}
                      onChange={() => {
                        const newPets = [...formPets];
                        newPets[index].neutered = pet.neutered === true ? null : true;
                        setFormPets(newPets);
                      }}
                    />
                    <label>네</label>
                    <input
                      type="checkbox"
                      name="neutered"
                      checked={pet.neutered === false}
                      onChange={() => {
                        const newPets = [...formPets];
                        newPets[index].neutered = pet.neutered === false ? null : false;
                        setFormPets(newPets);
                      }}
                    />
                    <label>아니오</label>
                  </div>
                  <div className="flex flex-row gap-x-2">
                    <p>나이 :</p>
                    <input
                      type="text"
                      className="border"
                      name="age"
                      value={pet.age || ""}
                      onChange={(e) => {
                        const newPets = [...formPets];
                        newPets[index].age = e.target.value;
                        setFormPets(newPets);
                      }}
                    />
                  </div>
                  <div className="flex flex-row gap-x-2">
                    <p>무게 :</p>
                    <input
                      type="number"
                      step="0.1"
                      className="border"
                      name="weight"
                      value={pet.weight === null ? "" : pet.weight}
                      onChange={(e) => {
                        const newPets = [...formPets];
                        newPets[index].weight = (e.target.value === "") ? null : Number(e.target.value);
                        setFormPets(newPets);
                      }}
                    />
                  </div>
                  <div className="flex flex-row gap-x-2">
                    <p>성격 및 특징 :</p>
                    <select
                      name="characteristics"
                      id={`characteristics-${index}`}
                      className="w-16 border border-black"
                      value={pet.characteristics || ""}
                      onChange={(e) => {
                        const newPets = [...formPets];
                        newPets[index].characteristics = e.target.value;
                        setFormPets(newPets);
                      }}
                    >
                      {characteristicsArr.map((characteristic) => (
                        <option key={characteristic} value={characteristic}>
                          {characteristic}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="mt-2 h-8 w-20 rounded-lg border border-gray-400 text-red-500"
                    onClick={() => {
                      const newPets = formPets.filter((_, i) => i !== index);
                      setFormPets(newPets);
                    }}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
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
