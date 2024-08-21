"use client";

import { useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { locationStore } from "@/zustand/locationStore";
import { useRouter } from "next/navigation";

import { getConvertAddress } from "../../getConvertAddress";
import { useAuthStore } from "@/zustand/useAuth";
import { MateNextPostType, Pets } from "@/types/mate.type";

import Swal from "sweetalert2";
import PetForm from "./pet/petForm";
import { getConvertDate } from "../getConvertDate";

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
    date_time: getConvertDate(),
    members: "",
    recruiting: true,
    address: "",
    place_name: "",
    location: "",
    pet_id: []
  };

  // const initialPetState: Pets = {
  //   userId,
  //   pet_id: []
  // };

  const [formPosts, setFormPosts] = useState<Omit<MateNextPostType, "user_id">>(initialState);
  // const [formPets, setFormPets] = useState<Pets[]>([initialPetState]);

  // console.log(formPets);

  // 게시물 등록
  const addPost = async (formAllData: { post: MateNextPostType }) => {
    // console.log("데이터 넘어오는 거 확인", formAllData);
    try {
      const response = await fetch(`/api/mate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          post_data: formAllData.post
          // pets_data: formAllData.pets
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
    mutationFn: async (formAllData: { post: MateNextPostType }) => await addPost(formAllData),
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

  // 폼 유효성 검사
  const isFormValid = () => {
    const { title, date_time, members, place_name, content, pet_id } = formPosts;
    // pet_id가 배열인지 확인하고, 배열일 경우에만 길이를 체크
    const isPetSelected = Array.isArray(pet_id) && pet_id.length > 0;
    return !!(title && date_time && members && place_name && content && isPetSelected);
  };

  // 동물 정보 선택했는 지 확인
  // const isPetSelected = (formPosts: MateNextPostType): boolean => {
  //   return formPosts.some(pet => JSON.stringify(pet) !== JSON.stringify(initialState));
  // };

  const handleUploadPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid()) {
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
      }
      // pets: formPets
      // weight: pet.weight === null ? null : Number(pet.weight)
    };

    // console.log("formAllData 확인", formAllData);
    try {
      addMutation.mutate(formAllData);
      setFormPosts(initialState);
      // setFormPets([initialPetState]);

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

  // console.log(userPets)

  return (
    <div className="min-h-screen">
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
            <label htmlFor="title" className="w-full text-[1rem] font-[600]">
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
            <label htmlFor="date_time" className="w-fulltext-[1rem] font-[600]">
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
            <label htmlFor="members" className="text-[1rem] font-[600]">
              모집 인원 수
            </label>
            <input
              type="number"
              id="members"
              placeholder="0"
              className="rounded-[0.5rem] border border-subTitle2 p-[0.75rem]"
              value={formPosts.members || ""}
              onChange={(e) => setFormPosts({ ...formPosts, members: e.target.value })}
              min="0"
            />
          </div>
        </div>
        <div className="mb-[1rem] mt-[1.94rem] flex flex-col gap-y-[0.5rem] px-[1.5rem]">
          <label className="text-[1rem] font-[600]">산책 장소</label>
          <div className="relative z-10">
            <DynamicMapComponent center={{ lat: 37.5556236021213, lng: 126.992199507869 }} />
          </div>
        </div>
        <div className="px-[1.5rem]">
          <div className="mb-[2rem] flex flex-col gap-y-[0.5rem]">
            <p className="text-[1rem] font-[600]">주소</p>
            <div className="border-b border-subTitle2 p-[0.75rem]">
              <p className="text-subTitle1">{roadAddress}</p>
            </div>
          </div>
          <div className="flex flex-col gap-y-[0.5rem]">
            <label className="text-[1rem] font-[600]">장소 정보</label>
            <input
              type="text"
              className="rounded-[0.5rem] border border-subTitle2 p-[0.75rem]"
              value={formPosts.place_name || ""}
              onChange={(e) => setFormPosts({ ...formPosts, place_name: e.target.value })}
              placeholder="장소 정보를 추가로 기입해 주세요. ex) 00공원 등"
            />
          </div>
        </div>
        {/* 내용 */}
        <div className="mb-[1rem] mt-[1.06rem] flex flex-col gap-y-[0.5rem] px-[1.5rem]">
          <label htmlFor="content" className="text-[1rem] font-[600]">
            내용
          </label>
          <textarea
            value={formPosts.content || ""}
            onChange={(e) => setFormPosts({ ...formPosts, content: e.target.value })}
            placeholder="선호하는 산책 동선이나 총 예상 산책 시간, 혹은 특별한 요구 사항이 있다면 적어주세요."
            className="h-[6.0625rem] w-full resize-none overflow-x-scroll rounded-[0.5rem] border border-subTitle2 p-[0.75rem] scrollbar-hide"
            id="content"
            maxLength={199}
          ></textarea>
          <p className="flex justify-end text-subTitle2">{formPosts.content?.length}/200</p>
        </div>
        {/* 반려동물 정보 등록 */}
        <PetForm setFormPosts={setFormPosts} userId={userId} />
        {/* 작성하기 버튼 */}
        <div className="mb-[7.5rem] mt-[1.5rem] flex w-full items-center justify-center px-[1.5rem]">
          <button
            type="submit"
            className={`w-full cursor-pointer rounded-full px-[1.5rem] py-[0.75rem] text-white ${
              !isFormValid() ? "cursor-not-allowed bg-gray-400 opacity-50" : "bg-mainColor"
            }`}
            disabled={!isFormValid()}
          >
            작성완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
