"use client";

import { useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { locationStore } from "@/zustand/locationStore";
import { useRouter } from "next/navigation";

import { getConvertAddress } from "../../getConvertAddress";
import { useAuthStore } from "@/zustand/useAuth";
import { MateNextPostType, Pets } from "@/types/mate.type";
import { characteristicsArr } from "../../selectOptionArray";
import Swal from "sweetalert2";

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
    address: "",
    place_name: "",
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

  // console.log(formPosts);

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

      // console.log("Response status:", response.status); // 응답 상태 로그

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Response data:", data);

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

  const handleAddPets = () => {
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
  };

  const handleUploadPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { title, date_time, members, place_name, content } = formPosts;

    if (!title || !date_time || !members || !place_name || !content) {
      // alert("모든 항목을 입력해 주세요!");
      Swal.fire({
        title: "모든 항목을 입력해 주세요!",
        text: "빠진 부분이 있는지 확인해 주세요.",
        icon: "warning"
      });
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

      // alert("등록되었습니다!");
      Swal.fire({
        title: "완료!",
        text: "게시글이 등록되었습니다!",
        icon: "success"
      });
      router.replace("/mate");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="">
      <form onSubmit={handleUploadPost} className="flex flex-col">
        {/* 소개 부분 */}
        <div className="mt-[2.69rem] flex flex-col px-[1.5rem]">
          <h1 className="mb-[1rem] text-[2rem] font-[600]">글 작성하기</h1>
          <div className="text-[1rem] font-[500]">
            <p>함께 산책할 메이트를 구하는 글을 올려요!</p>
            <p>
              내용이 더 자세할수록 다른 메이트 분들에게
              <br />
              도움이 되어요.
            </p>
          </div>
        </div>
        <div className="mt-[2.69rem] flex flex-col justify-center px-[1.5rem]">
          <div className="mb-[1rem] flex flex-col gap-y-[0.5rem]">
            <label htmlFor="title" className="w-full text-[1rem] font-[500]">
              제목
            </label>
            <input
              type="text"
              value={formPosts.title || ""}
              onChange={(e) => setFormPosts({ ...formPosts, title: e.target.value })}
              placeholder="제목을 입력해 주세요"
              className="rounded-[0.5rem] border border-subTitle2 p-[0.75rem]"
              id="title"
            />
          </div>
          <div className="mb-[1rem] flex w-full flex-col gap-y-[0.5rem]">
            <label htmlFor="date_time" className="w-fulltext-[1rem] font-[500]">
              산책 일시
            </label>
            <input
              type="datetime-local"
              id="date_time"
              value={formPosts.date_time || ""}
              onChange={(e) => setFormPosts({ ...formPosts, date_time: e.target.value })}
              className="rounded-[0.5rem] border border-subTitle2 p-[0.75rem] text-subTitle1"
            />
          </div>
          <div className="flex flex-col gap-y-[0.5rem]">
            <label htmlFor="members" className="text-[1rem] font-[500]">
              모집 인원 수
            </label>
            <input
              type="number"
              id="members"
              placeholder="0"
              className="rounded-[0.5rem] border border-subTitle2 p-[0.75rem]"
              value={formPosts.members || ""}
              onChange={(e) => setFormPosts({ ...formPosts, members: e.target.value })}
            />
          </div>
        </div>
        <div className="mb-[1rem] mt-[1.94rem] flex flex-col gap-y-[0.5rem] px-[1.5rem]">
          <label className="text-[1rem] font-[500]">산책 장소</label>
          <div>
            <DynamicMapComponent center={{ lat: 37.5556236021213, lng: 126.992199507869 }} />
          </div>
        </div>
        <div className="px-[1.5rem]">
          <div className="mb-[2rem] flex flex-col gap-y-[0.5rem]">
            <p className="text-[1rem] font-[500]">주소</p>
            <div className="border-b border-subTitle2 p-[0.75rem]">
              <p className="text-subTitle1">{roadAddress}</p>
            </div>
          </div>
          <div className="flex flex-col gap-y-[0.5rem]">
            <label>장소 정보</label>
            <input
              type="text"
              className="rounded-[0.5rem] border border-subTitle2 p-[0.75rem]"
              value={formPosts.place_name || ""}
              onChange={(e) => setFormPosts({ ...formPosts, place_name: e.target.value })}
              placeholder="장소 정보를 추가로 기입해 주세요"
            />
          </div>
        </div>
        {/* 한마디 */}
        <div className="mb-[1rem] mt-[1.06rem] flex flex-col gap-y-[0.5rem] px-[1.5rem]">
          <label htmlFor="content" className="text-[1rem] font-[600]">
            한 마디
          </label>
          <textarea
            value={formPosts.content || ""}
            onChange={(e) => setFormPosts({ ...formPosts, content: e.target.value })}
            placeholder="선호하는 산책 동선이나 총 예상 산책 시간,    
            혹은 특별한 요구 사항이 있다면 적어주세요."
            className="h-[6.0625rem] w-full resize-none rounded-[0.5rem] border border-subTitle2 p-[0.75rem]"
            id="content"
            maxLength={200}
          ></textarea>
          <p className="flex justify-end text-subTitle2">0/200</p>
        </div>

        <div>
          {/* 반려동물 정보 */}
          <div className="flex justify-between px-[1.5rem]">
            {/* TODO: 폰트 정해지면 간격 재조절 필요 */}
            <p className="mt-[2.19rem] text-[1rem] font-[500]">반려견 정보 입력</p>
            <button
              type="button"
              className="mt-[1.63rem] rounded-full bg-[#D2CDF6] px-[2.34rem] py-[0.5rem] text-[1rem] font-[600] text-[#77746E]"
              onClick={handleAddPets}
            >
              반려동물 정보 추가
            </button>
          </div>
          <div className="mt-[0.81rem] flex w-full flex-col px-[0.75rem]">
            <div className="grid grid-cols-1 ">
              {formPets.map((pet, index) => (
                <div key={index} className="rounded-lg border border-[#E0E0E0] px-[0.75rem] py-[0.69rem]">
                  <div className="grid grid-cols-1">
                    <div className="flex flex-col ">
                      <label className="text-md font-semibold">반려견 성별</label>
                      <select
                        name={`male_female_${index}`}
                        value={pet.male_female}
                        onChange={(e) => {
                          const newPets = [...formPets];
                          newPets[index].male_female = e.target.value;
                          setFormPets(newPets);
                        }}
                        className="rounded-[0.5rem] border border-subTitle2 p-[0.75rem] text-subTitle1"
                      >
                        <option value="">선택하세요</option>
                        <option value="female">암컷</option>
                        <option value="male">수컷</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <label className="text-md font-semibold">중성화 여부</label>
                      <select
                        name={`neutered_${index}`}
                        value={pet.neutered || ""}
                        onChange={(e) => {
                          const newPets = [...formPets];
                          newPets[index].neutered = e.target.value;
                          setFormPets(newPets);
                        }}
                        className="rounded-[0.5rem] border border-subTitle2 p-[0.75rem] text-subTitle1"
                      >
                        <option value="">선택하세요</option>
                        <option value="true">네</option>
                        <option value="false">아니오</option>
                      </select>
                    </div>
                    <div className="flex w-full flex-col gap-y-[0.5rem]">
                      <label htmlFor={`age_${index}`} className="text-md font-semibold">
                        반려견 나이
                      </label>
                      <input
                        type="text"
                        id={`age_${index}`}
                        className="rounded-[0.5rem] border border-subTitle2 p-[0.75rem]"
                        value={pet.age || ""}
                        placeholder="반려견의 나이를 입력해 주세요"
                        onChange={(e) => {
                          const newPets = [...formPets];
                          newPets[index].age = e.target.value;
                          setFormPets(newPets);
                        }}
                      />
                    </div>
                    <div className="flex w-full flex-col gap-y-2">
                      <label htmlFor={`weight_${index}`} className="text-md font-semibold">
                        반려견 무게
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id={`weight_${index}`}
                        className="rounded-[0.5rem] border border-subTitle2 p-[0.75rem]"
                        value={pet.weight === null ? "" : pet.weight}
                        placeholder="반려견의 몸무게를 입력해 주세요"
                        onChange={(e) => {
                          const newPets = [...formPets];
                          newPets[index].weight = e.target.value === "" ? null : Number(e.target.value);
                          setFormPets(newPets);
                        }}
                      />
                    </div>
                    <div className="flex w-full flex-col gap-y-2">
                      <label htmlFor={`characteristics_${index}`} className="text-md font-semibold">
                        반려견 성향
                      </label>
                      <select
                        id={`characteristics_${index}`}
                        className="rounded-[0.5rem] border border-subTitle2 p-[0.75rem] text-subTitle1"
                        value={pet.characteristics || ""}
                        onChange={(e) => {
                          const newPets = [...formPets];
                          newPets[index].characteristics = e.target.value;
                          setFormPets(newPets);
                        }}
                      >
                        <option value="">반려견의 성향을 선택해 주세요</option>
                        {characteristicsArr.map((characteristic) => (
                          <option key={characteristic} value={characteristic}>
                            {characteristic}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex w-full justify-end">
                    <button
                      type="button"
                      className="mt-8 h-[30px] w-[120px] rounded-md bg-red-100 text-red-600 transition-colors hover:bg-red-200"
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
        {/* 작성하기 버튼 */}
        <div className="mb-[1.94rem] mt-[6.44rem] flex w-full items-center justify-center px-[1.5rem]">
          <button
            type="submit"
            className="w-full cursor-pointer rounded-full bg-mainColor px-[1.5rem] py-[0.75rem] text-white"
          >
            작성완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
