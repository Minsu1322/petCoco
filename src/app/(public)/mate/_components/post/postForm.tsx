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
import { characteristicsArr } from "../../selectOptionArray";

// 동적 로딩 설정
const DynamicMapComponent = dynamic(() => import("@/app/(public)/mate/_components/map/mapForm"), { ssr: false });

const PostForm = () => {
  const { user } = useAuthStore();
  const userId: string = user && user.id;
  const queryClient = useQueryClient();
  const router = useRouter();
  const { position } = locationStore();

  const initialState: Omit<MateNextPostType, "user_id"> = {
    title: "",
    content: "",
    position: { center: { lat: 37.5556236021213, lng: 126.992199507869 }, errMsg: null, isLoading: true },
    date_time: "",
    members: "",
    recruiting: true,
    recruitment_start: "",
    recruitment_end: "",
    address: "",
    place_name: "",
    preferred_route: "",
    special_requirements: "",
    location: ""
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

  console.log(formPosts);

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
  //  console.log(addressData)

  const address = (addressData && addressData?.documents[0]?.address?.address_name) || "주소 정보를 찾을 수 없어요";

  const handleUploadPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { title, date_time, members, recruitment_start, recruitment_end, place_name, preferred_route, content } =
      formPosts;

    if (
      !title ||
      !date_time ||
      !members ||
      !recruitment_start ||
      !recruitment_end ||
      !place_name ||
      !preferred_route ||
      !content
    ) {
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
    <div className="container mx-auto mb-5 mt-10 px-4">
      <form onSubmit={handleUploadPost} className="mx-auto flex max-w-4xl flex-col items-center">
        <div className="mb-5 flex flex-col items-center justify-between">
          <h1 className="mb-3 text-3xl font-semibold">산책 메이트 모집 글 작성하기</h1>
        </div>
        <div className="mt-[40px] flex w-full flex-col gap-y-5">
          <div className="flex flex-col">
            <label htmlFor="title" className="w-full text-lg font-semibold">
              제목
            </label>
            <input
              type="text"
              value={formPosts.title || ""}
              onChange={(e) => setFormPosts({ ...formPosts, title: e.target.value })}
              placeholder=" 제목을 입력해 주세요"
              className="mt-3 h-10 w-full rounded-md border border-gray-300"
              id="title"
            />
          </div>
          <div className="mt-[10px] flex w-full items-center justify-between">
            <div className="flex w-full flex-col">
              <label htmlFor="date_time" className="w-full text-lg font-semibold">
                희망 날짜 및 시간
              </label>
              <input
                type="datetime-local"
                id="date_time"
                value={formPosts.date_time || ""}
                onChange={(e) => setFormPosts({ ...formPosts, date_time: e.target.value })}
                className="mt-3 h-10 w-full rounded-md border border-gray-300"
              />
            </div>
            <div className="ml-[20px] flex w-[200px] flex-col">
              <label htmlFor="members" className="w-[150px] whitespace-nowrap text-lg font-semibold">
                모집 인원 수
              </label>
              <div className="flex flex-row items-center gap-x-2">
                <input
                  type="text"
                  id="members"
                  placeholder="0"
                  className="mt-3 h-10 w-[150px] rounded-md border border-gray-300 text-center"
                  value={formPosts.members || ""}
                  onChange={(e) => setFormPosts({ ...formPosts, members: e.target.value })}
                />
                <span className="mt-3 flex h-10 items-center">명</span>
              </div>
            </div>
          </div>
          <div className="mt-[10px] flex w-full flex-col gap-y-2">
            <label htmlFor="recruitment_period" className="w-full whitespace-nowrap text-lg font-semibold">
              모집기간
            </label>
            <div className="flex flex-row items-center gap-x-2">
              <input
                type="datetime-local"
                id="recruitment_start"
                value={formPosts.recruitment_start || ""}
                onChange={(e) => setFormPosts({ ...formPosts, recruitment_start: e.target.value })}
                className="h-10 w-full rounded-md border border-gray-300"
              />
              <span>~</span>
              <input
                type="datetime-local"
                id="recruitment_end"
                value={formPosts.recruitment_end || ""}
                onChange={(e) => setFormPosts({ ...formPosts, recruitment_end: e.target.value })}
                className="h-10 w-full rounded-md border border-gray-300"
              />
            </div>
          </div>
          <div className="mt-[20px] flex">
            <div>
              <label className="w-full text-lg font-semibold">산책 장소</label>
              <div className="w-full">
                <div className="mt-4">
                  <DynamicMapComponent center={{ lat: 37.5556236021213, lng: 126.992199507869 }} />
                </div>
              </div>
            </div>
            <div className="ml-[20px] mt-[35px] w-full">
              <div>
                <p className="my-2 flex">
                  <p className="mr-2 text-lg font-semibold">클릭한 곳의 주소는?</p> {roadAddress}
                </p>
                <input
                  type="text"
                  className="h-10 w-full rounded-md border border-gray-300"
                  value={formPosts.place_name || ""}
                  onChange={(e) => setFormPosts({ ...formPosts, place_name: e.target.value })}
                  placeholder=" 장소 정보를 추가로 기입해 주세요"
                />
              </div>
              <div className="flex flex-col items-start gap-y-2">
                <label htmlFor="preferred_route" className="mt-[30px] text-lg font-semibold">
                  선호하는 산책 루트
                </label>
                <input
                  type="text"
                  id="preferred_route"
                  className="h-10 w-full rounded-md border border-gray-300"
                  placeholder=" 선호하는 산책 루트가 있다면 적어주세요!"
                  value={formPosts.preferred_route || ""}
                  onChange={(e) => setFormPosts({ ...formPosts, preferred_route: e.target.value })}
                />
              </div>
              <div className="flex flex-col items-start gap-y-2">
                <label htmlFor="special_requirements" className="mt-[30px] text-lg font-semibold">
                  특별한 요구사항
                </label>
                <input
                  type="text"
                  id="special_requirements"
                  className="h-10 w-full rounded-md border border-gray-300"
                  placeholder=" 메이트에게 원하는 특별한 사항이 있다면 적어주세요!"
                  value={formPosts.special_requirements || ""}
                  onChange={(e) => setFormPosts({ ...formPosts, special_requirements: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="mt-[20px] flex flex-col items-start">
            <label htmlFor="content" className="text-lg font-semibold">
              내용
            </label>
            <textarea
              value={formPosts.content || ""}
              onChange={(e) => setFormPosts({ ...formPosts, content: e.target.value })}
              placeholder=" 글을 작성해 주세요."
              className="mt-4 h-40 w-full resize-none rounded-md border border-gray-300 p-1"
              id="content"
            ></textarea>
          </div>

          {/* 반려동물 정보 */}
          <div className="mt-3 flex w-full flex-col gap-y-5">
            <div className="flex items-center justify-between gap-x-2">
              <div className="flex items-center">
                <span className="mr-2 text-3xl">🐶</span>
                <h2 className="text-lg font-semibold">반려동물 정보</h2>
              </div>
              <div>
                <button
                  type="button"
                  className="h-[40px] w-[200px] rounded-md border-2 border-mainColor bg-white px-4 transition-colors hover:bg-gray-300"
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
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {formPets.map((pet, index) => (
                <div key={index} className="rounded-lg bg-gray-50 p-6 shadow-sm">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex w-[300px] justify-between">
                      <div className="flex flex-col gap-y-2">
                        <label className="text-md font-semibold">성별</label>
                        <div className="flex gap-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`male_female_${index}`}
                              value="female"
                              checked={pet.male_female === "female"}
                              onChange={() => {
                                const newPets = [...formPets];
                                newPets[index].male_female = "female";
                                setFormPets(newPets);
                              }}
                              className="mr-2"
                            />
                            암컷
                          </label>
                          <label className="text-md flex items-center">
                            <input
                              type="radio"
                              name={`male_female_${index}`}
                              value="male"
                              checked={pet.male_female === "male"}
                              onChange={() => {
                                const newPets = [...formPets];
                                newPets[index].male_female = "male";
                                setFormPets(newPets);
                              }}
                              className="mr-2"
                            />
                            수컷
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <label className="text-md font-semibold">중성화 여부</label>
                        <div className="flex gap-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`neutered_${index}`}
                              checked={pet.neutered === true}
                              onChange={() => {
                                const newPets = [...formPets];
                                newPets[index].neutered = true;
                                setFormPets(newPets);
                              }}
                              className="mr-2"
                            />
                            네
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`neutered_${index}`}
                              checked={pet.neutered === false}
                              onChange={() => {
                                const newPets = [...formPets];
                                newPets[index].neutered = false;
                                setFormPets(newPets);
                              }}
                              className="mr-2"
                            />
                            아니오
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-[20px] flex w-full justify-between gap-5">
                      <div className="flex w-full flex-col gap-y-2">
                        <label htmlFor={`age_${index}`} className="text-md font-semibold">
                          나이
                        </label>
                        <input
                          type="text"
                          id={`age_${index}`}
                          className="w-full rounded-md border p-2"
                          value={pet.age || ""}
                          onChange={(e) => {
                            const newPets = [...formPets];
                            newPets[index].age = e.target.value;
                            setFormPets(newPets);
                          }}
                        />
                      </div>
                      <div className="flex w-full flex-col gap-y-2">
                        <label htmlFor={`weight_${index}`} className="text-md font-semibold">
                          무게
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          id={`weight_${index}`}
                          className="w-full rounded-md border p-2"
                          value={pet.weight === null ? "" : pet.weight}
                          onChange={(e) => {
                            const newPets = [...formPets];
                            newPets[index].weight = e.target.value === "" ? null : Number(e.target.value);
                            setFormPets(newPets);
                          }}
                        />
                      </div>
                      <div className="flex w-full flex-col gap-y-2">
                        <label htmlFor={`characteristics_${index}`} className="text-md font-semibold">
                          성격 및 특징
                        </label>
                        <select
                          id={`characteristics_${index}`}
                          className="w-full rounded-md border p-2"
                          value={pet.characteristics || ""}
                          onChange={(e) => {
                            const newPets = [...formPets];
                            newPets[index].characteristics = e.target.value;
                            setFormPets(newPets);
                          }}
                        >
                          <option value="">선택</option>
                          {characteristicsArr.map((characteristic) => (
                            <option key={characteristic} value={characteristic}>
                              {characteristic}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full justify-end">
                    <button
                      type="button"
                      className="mt-8 h-[50px] w-[120px] rounded-md bg-red-100 text-red-600 transition-colors hover:bg-red-200"
                      onClick={() => {
                        const newPets = formPets.filter((_, i) => i !== index);
                        setFormPets(newPets);
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <button
            type="submit"
            className="mb-[40px] mt-[60px] flex h-[60px] w-[250px] items-center justify-center rounded-md bg-mainColor"
          >
            작성완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
