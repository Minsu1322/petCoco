"use client";

import { MateNextPostType, MatePostAllType } from "@/types/mate.type";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { locationStore } from "@/zustand/locationStore";
import { getConvertAddress } from "../../getConvertAddress";
import { useAuthStore } from "@/zustand/useAuth";
import { getConvertTime } from "@/app/utils/getConvertTime";
import { getConvertDate } from "../../_components/getConvertDate";

interface DetailMatePostProps {
  post: MatePostAllType;
}

// 동적 로딩 설정
const DynamicMapComponent = dynamic(() => import("@/app/(public)/mate/_components/map/mapDetail"), { ssr: false });
const DynamicMapEditComponent = dynamic(() => import("@/app/(public)/mate/_components/map/mapEdit"), { ssr: false });

const DetailMatePost = ({ post }: DetailMatePostProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user && user.id;
  const router = useRouter();

  const { position, setPosition } = locationStore();

  const initialState: Omit<MateNextPostType, "user_id" | "position"> = {
    title: post.title || "",
    content: post.content || "",
    // position: { center: { lat: 37.5556236021213, lng: 126.992199507869 }, errMsg: null, isLoading: true },
    date_time: post.date_time || "",
    members: post.members || "",
    recruiting: post.recruiting || true,
    recruitment_start: getConvertDate(post.recruitment_start || ""),
    recruitment_end: getConvertDate(post.recruitment_end || ""),
    address: post.address || "",
    place_name: post.place_name || "",
    preferred_route: post.preferred_route || "",
    special_requirements: post.special_requirements || "",
    location: post.location || ""
  };


  // const initialPetState: matepostpetsType = {
  //   male_female: "",
  //   neutered: null,
  //   weight: "",
  //   characteristics: "",
  //   age: ""
  // };

  const [formPosts, setFormPosts] = useState<Omit<MateNextPostType, "user_id" | "position">>(initialState);
  // const [formPets, setFormPets] = useState<matepostpetsType[]>([initialPetState]);

  const [isEditing, setIstEditting] = useState<boolean>(false);

  // console.log(post.users);

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

  //console.log("주소 변환 데이터 확인", addressData);

  const updatePost = {
    ...formPosts,
    address,
    position
  };

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/mate/post/${post.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.replace("/mate");
    } catch (error) {
      console.error(error);
    }
  };

  const editPost = async (id: string) => {
    try {
      const response = await fetch(`/api/mate/post/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatePost)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.replace("/mate");
    } catch (error) {
      console.error(error);
    }
  };

  const togglePost = async (id: string) => {
    if (confirm("모집 상태를 변경하시겠어요?")) {
      try {
        const response = await fetch(`/api/mate/post/${post.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ recruiting: !post.recruiting })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        router.replace("/mate");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
      alert("삭제가 완료되었습니다.");
    },
    onError: (error) => {
      console.error("삭제 중 오류 발생:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  });

  const editMutation = useMutation({
    mutationFn: (id: string) => editPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
      alert("수정이 완료되었습니다.");
      setIstEditting(false);
    },
    onError: (error) => {
      console.error("수정 중 오류 발생:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => togglePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
    }
  });

  const handleDeletePost = (id: string) => {
    if (confirm("현재 게시글을 삭제하시겠어요?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleUpdatePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지
    editMutation.mutate(post.id);
  };

  const handleEditPost = () => {
    if (confirm("현재 게시글을 수정하시겠어요?")) {
      setIstEditting(true);
    }
  };

  const handleTogglePost = (id: string) => {
    toggleMutation.mutate(id);
  };

  const handleResetEditPost = () => {
    setIstEditting(false);
    setPosition({
      center: {
        lat: Number(post.position?.center?.lat),
        lng: Number(post.position?.center?.lng)
      },
      isLoading: false
    });
  };

  return (
    <div className="container mx-auto mb-5 mt-10 px-4">
      {isEditing ? (
        <form onSubmit={handleUpdatePost} className="mx-auto flex max-w-4xl flex-col items-center">
          <div className="mb-5 flex flex-col items-center justify-between">
            <h1 className="mb-3 text-3xl font-semibold">산책 메이트 모집 글 수정하기</h1>
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
                <div className="mt-4">
                  <DynamicMapEditComponent
                    center={{
                      lat: Number(post.position?.center?.lat),
                      lng: Number(post.position?.center?.lng)
                    }}
                    isEditing={true}
                    dbPosition={{
                      lat: Number(post.position?.center?.lat),
                      lng: Number(post.position?.center?.lng)
                    }}
                  />
                </div>
              </div>
              <div className="ml-[20px] mt-[35px] w-full">
                <div>
                  <div className="my-2 flex flex-col">
                    <p className="mr-2 text-lg font-semibold">클릭한 곳의 주소는?</p>
                    <p>{roadAddress}</p>
                  </div>
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
            <div className="mb-5 mt-8 flex flex-row justify-end gap-3">
              <button
                className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-editBtnColor px-4 sm:w-auto"
                type="submit"
              >
                수정 완료
              </button>
              <button
                className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-delBtnColor px-4 sm:w-auto"
                type="button"
                onClick={handleResetEditPost}
              >
                수정 취소
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          {/* 제목 및 버튼 영역 */}
          <div className="mb-3 flex w-full flex-row items-center justify-between">
            <div className="flex-shrink-0">
              <p className="text-3xl font-semibold">{post.title}</p>
            </div>
            <div className="flex-shrink-0">
              {userId === post.user_id && (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="flex h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-editBtnColor px-4"
                    onClick={handleEditPost}
                  >
                    수정
                  </button>
                  <button
                    className="flex h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-delBtnColor px-4"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    삭제
                  </button>
                  <button
                    className="flex h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-gray-200 px-4"
                    onClick={() => handleTogglePost(post.id)}
                  >
                    모집상태 변경
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* 프로필 영역 */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Image
                src={
                  post.users && post.users?.profile_img
                    ? post.users?.profile_img
                    : "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/post_image/1722324396777_xo2ka9.jpg"
                }
                alt="사용자 프로필 이미지"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="text-gray-500">
                <p>{post.users?.nickname}</p>
                <p>{new Date(post.created_at).toLocaleString()}</p>
              </div>
            </div>
            {/* 컨텐츠 영역 */}
            <div className="mt-[10px] flex w-full items-center justify-between">
              <div className="flex flex-col">
                <p className="w-full text-lg font-semibold"> 희망 날짜 및 시간</p>
                <p className="mt-3 h-10 w-full">
                  {post.date_time?.split("T")[0]} {getConvertTime({ date_time: post.date_time || "" })}
                </p>
              </div>
              <div className="ml-[20px] flex w-[200px] flex-col">
                <div className="flex flex-col">
                  <p className="w-[150px] whitespace-nowrap text-lg font-semibold">모집 인원 수</p>
                  <div>
                    <p className="mt-3 h-10 w-full">{post.members}명</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex w-full flex-col">
                  <p className="mb-3 w-full text-lg font-semibold">모집기간</p>
                  <p className="h-10 w-full">
                  {post.recruitment_start?.split("T")[0]}{" "}{getConvertTime({ date_time: post.recruitment_start || "" })}
               ~ {post.recruitment_end?.split("T")[0]}{" "}{getConvertTime({ date_time: post.recruitment_end || "" })}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[20px] flex flex-row">
              <div className="mt-3">
                <p className="w-full text-lg font-semibold">산책 장소</p>
                <div className="w-full">
                  <div className="mt-4">
                    <DynamicMapComponent
                      center={{
                        lat: Number(post.position?.center?.lat),
                        lng: Number(post.position?.center?.lng)
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="ml-[20px] mt-[35px] w-full">
                <div>
                  <div className="my-2 flex flex-col">
                    <p className="mr-2 mt-3 text-lg font-semibold">만나기로 한 곳의 주소는?</p>
                    <p className="mt-2">{post.address}</p>
                    <p>{post.place_name}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-y-2">
                  <p className="mt-[30px] text-lg font-semibold">선호하는 산책 루트</p>
                  <p>{post.preferred_route}</p>
                </div>
                <div className="flex flex-col items-start gap-y-2">
                  <p className="mt-[30px] text-lg font-semibold">특별한 요구사항</p>
                  {post.special_requirements}
                </div>
              </div>
            </div>
            <div className="mt-[20px] flex flex-col items-start">
              <p className="text-lg font-semibold">내용</p>
              <p className="mt-4 w-full rounded-md border border-gray-300 p-5"> {post.content}</p>
            </div>
          </div>
          {/* 반려동물 정보 */}
          <div className="mt-5 flex w-full flex-col gap-y-5">
            <div className="flex items-center">
              <span className="mr-2 text-3xl">🐶</span>
              <h2 className="text-lg font-semibold">반려동물 정보</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {post.matepostpets && post.matepostpets.length > 0 ? (
                post.matepostpets.map((pet) => (
                  <div className="rounded-lg bg-gray-50 p-6 shadow-sm" key={pet.id}>
                    <p>성별: {pet.male_female === "male" ? "남" : pet.male_female === "female" ? "여" : ""}</p>
                    <p>중성화 여부: {pet.neutered ? "예" : pet.neutered === false ? "아니오" : ""}</p>
                    <p>나이: {pet.age ? `${pet.age}살` : ""}</p>
                    <p>무게: {pet.weight ? `${pet.weight} kg` : ""}</p>
                    <p>성격 및 특징: {pet.characteristics || ""}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center rounded-md bg-gray-200 p-4 text-gray-600">
                  반려동물 정보가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailMatePost;
