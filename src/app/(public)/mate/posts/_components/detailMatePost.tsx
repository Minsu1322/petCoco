"use client";

import { MateNextPostType, MatePostAllType, MatePostFullType, MatePostPetsType } from "@/types/mate.type";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { locationStore } from "@/zustand/locationStore";
import { getConvertAddress } from "../../getConvertAddress";
import { useAuthStore } from "@/zustand/useAuth";
import { getConvertTime } from "@/app/utils/getConvertTime";

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
    recruitment_start: post.recruitment_start || "",
    recruitment_end: post.recruitment_end || "",
    address: post.address || "",
    place_name: post.place_name || "",
    preferred_route: post.preferred_route || "",
    special_requirements: post.special_requirements || ""
  };

  // const initialPetState: MatePostPetsType = {
  //   male_female: "",
  //   neutered: null,
  //   weight: "",
  //   characteristics: "",
  //   age: ""
  // };

  const [formPosts, setFormPosts] = useState<Omit<MateNextPostType, "user_id" | "position">>(initialState);
  // const [formPets, setFormPets] = useState<MatePostPetsType[]>([initialPetState]);

  const [isEditing, setIstEditting] = useState<boolean>(false);

  //console.log(post);

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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
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
      } catch (err) {
        console.error(err);
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

  // useEffect(() => {
  //   setFormPosts((prev) => ({
  //     ...prev,
  //     title: post.title || "",
  //     content: post.content || "",
  //     date_time: post.date_time || "",
  //     members: post.members || "",

  //   }));
  //   setFormPets((prev) => ({
  //     ...prev,
  //     male_female: post.matePostPets.male_female || "",
  //     neutered: post.matePostPets.neutered || null,
  //     age: post.matePostPets.age || "",
  //     weight: post.matePostPets.weight || "",
  //     characteristics: post.matePostPets.characteristics || ""
  //   }))
  // }, []);

  return (
    <div className="container mx-auto pb-5">
      {/* <Link href="/mate">
        <div className="flex h-10 w-20 cursor-pointer items-center justify-center rounded-md bg-mainColor p-1">
          뒤로가기
        </div>
      </Link> */}
      {isEditing ? (
        <form onSubmit={handleUpdatePost} className="flex flex-col">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-2xl font-semibold">산책 메이트 모집 글 작성하기</h1>
            <div className="flex flex-row gap-x-3">
              <button
                className="bg-editBtnColor flex h-8 cursor-pointer items-center justify-center rounded-md px-3"
                type="submit"
              >
                수정 완료
              </button>
              <button
                className="bg-delBtnColor flex h-8 cursor-pointer items-center justify-center rounded-md px-3"
                type="button"
                onClick={handleResetEditPost}
              >
                수정 취소
              </button>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="flex w-5/6 flex-col gap-y-5 bg-blue-300">
              <div className="flex flex-row items-center gap-x-3">
                <label htmlFor="title">제목</label>
                <input
                  type="text"
                  value={formPosts.title || ""}
                  onChange={(e) => setFormPosts({ ...formPosts, title: e.target.value })}
                  placeholder=" 제목을 입력해 주세요"
                  className="h-10 w-3/4 rounded-md border border-gray-300"
                  id="title"
                />
              </div>
              <div className="flex flex-row gap-x-4">
                <label htmlFor="date_time">희망 날짜 및 시간</label>
                <input
                  type="datetime-local"
                  id="date_time"
                  value={formPosts.date_time || ""}
                  onChange={(e) => setFormPosts({ ...formPosts, date_time: e.target.value })}
                  className="h-10 w-1/4 rounded-md border border-gray-300"
                />
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-x-2">
                  <label htmlFor="recruitment_period">모집기간</label>
                  <input
                    type="datetime-local"
                    id="recruitment_start"
                    value={formPosts.recruitment_start || ""}
                    onChange={(e) => setFormPosts({ ...formPosts, recruitment_start: e.target.value })}
                    className="h-10 w-3/4 rounded-md border border-gray-300"
                  />
                  <span>~</span>
                  <input
                    type="datetime-local"
                    id="recruitment_end"
                    value={formPosts.recruitment_end || ""}
                    onChange={(e) => setFormPosts({ ...formPosts, recruitment_end: e.target.value })}
                    className="h-10 w-3/4 rounded-md border border-gray-300"
                  />
                </div>
                <div className="flex flex-row items-center gap-x-2">
                  <label htmlFor="members">모집 인원 수</label>
                  <input
                    type="text"
                    id="members"
                    className="h-10 rounded-md border border-gray-300"
                    value={formPosts.members || ""}
                    onChange={(e) => setFormPosts({ ...formPosts, members: e.target.value })}
                  />
                  명
                </div>
              </div>
              <div className="flex w-4/6 flex-row gap-x-3">
                <label>산책 장소</label>
                <div>
                  <div>
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
                    <p>클릭한 곳의 주소는? {roadAddress}</p>
                  </div>
                  <input
                    type="text"
                    className="h-10 w-5/6 rounded-md border border-gray-300"
                    value={formPosts.place_name || ""}
                    onChange={(e) => setFormPosts({ ...formPosts, place_name: e.target.value })}
                    placeholder=" 장소 정보를 추가로 기입해 주세요"
                  />
                </div>
              </div>
              <div className="flex flex-row items-center gap-x-2">
                <label htmlFor="preferred_route">선호하는 산책 루트</label>
                <input
                  type="text"
                  id="preferred_route"
                  className="h-10 w-2/6 rounded-md border border-gray-300"
                  placeholder=" 선호하는 산책 루트가 있다면 적어주세요!"
                  value={formPosts.preferred_route || ""}
                  onChange={(e) => setFormPosts({ ...formPosts, preferred_route: e.target.value })}
                />
              </div>
              <div className="flex flex-row items-center gap-x-2">
                <label htmlFor="special_requirements">특별한 요구사항</label>
                <input
                  type="text"
                  id="special_requirements"
                  className="h-10 w-2/6 rounded-md border border-gray-300"
                  placeholder=" 메이트에게 원하는 특별한 사항이 있다면 적어주세요!"
                  value={formPosts.special_requirements || ""}
                  onChange={(e) => setFormPosts({ ...formPosts, special_requirements: e.target.value })}
                />
              </div>
              <div className="flex w-4/6 items-start gap-x-2">
                <label htmlFor="content" className="mt-2">
                  내용
                </label>
                <textarea
                  value={formPosts.content || ""}
                  onChange={(e) => setFormPosts({ ...formPosts, content: e.target.value })}
                  placeholder=" 글을 작성해 주세요."
                  className="mt-1 h-40 w-5/6 resize-none rounded-md border border-gray-300 p-1"
                  id="content"
                ></textarea>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-xl font-semibold">반려동물 정보 🐶</p>
              <div className="flex flex-row gap-x-3">
                {post.matePostPets.map((pet) => (
                  <div className="w-48 rounded-md bg-gray-100 p-2" key={pet.id}>
                    <p>성별 : {pet.male_female === "male" ? "남" : "여"}</p>
                    <p>중성화 여부 : {pet.neutered === true ? "예" : "아니오"}</p>
                    <p>나이 : {pet.age}살</p>
                    <p>무게 : {pet.weight} kg</p>
                    <p>성격 : {pet.characteristics}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mt-10">
          <div className="mb-5 flex flex-row items-center justify-between">
            <p className="text-2xl font-semibold">{post.title}</p>
            {userId === post.user_id && (
              <div className="flex flex-row gap-x-5">
                <button
                  className="bg-editBtnColor flex h-8 w-16 cursor-pointer items-center justify-center rounded-md p-2"
                  onClick={handleEditPost}
                >
                  수정
                </button>
                <button
                  className="bg-delBtnColor flex h-8 w-16 cursor-pointer items-center justify-center rounded-md p-2"
                  onClick={() => handleDeletePost(post.id)}
                >
                  삭제
                </button>
                <button
                  className="flex h-8 cursor-pointer items-center justify-center rounded-md bg-gray-200 p-2"
                  onClick={() => handleTogglePost(post.id)}
                >
                  모집상태 변경
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-row items-center gap-x-3">
              <div>
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN26a7CVa5ryzx5psOXRzK2a-OfomhbbUbw-zxRX7D835ImjsmTOc2tIgkc-LXQ2cFrf0&usqp=CAU"
                  alt="사용자 프로필 이미지"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col gap-y-2 text-gray-500">
                <p>{post.users?.nickname}</p>
                <p>{new Date(post.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex w-4/6 flex-row justify-between">
              <p>
                모집기간 : {post.recruitment_start?.split("T")[0]}{" "}
                {getConvertTime({ date_time: post.recruitment_start || "" })} ~{post.recruitment_end?.split("T")[0]}{" "}
                {getConvertTime({ date_time: post.recruitment_end || "" })}
              </p>
              <p>모집 인원 수 : {post.members}명</p>
            </div>
            <p>산책 장소 : {post.place_name}</p>
            <p>산책 날짜 : {post.date_time?.split("T")[0]}</p>
            <p>산책 시간 : {getConvertTime({ date_time: post.date_time || "" })}</p>
            <div>
              <DynamicMapComponent
                center={{
                  lat: Number(post.position?.center?.lat),
                  lng: Number(post.position?.center?.lng)
                }}
              />
            </div>
            <div className="flex flex-row items-center gap-x-2">
              <p>선호하는 산책 루트 : </p>
              {post.preferred_route}
            </div>
            <div className="flex flex-row items-center gap-x-2">
              <p>특별한 요구 사항 : </p>
              {post.special_requirements}
            </div>
            <div className="flex flex-row items-center gap-x-2">
              <p>내용 : </p>
              {post.content}
            </div>
            <div className="mt-5">
              <p className="mb-5 text-xl font-semibold">반려동물 정보 🐶</p>
              <div className="flex flex-row gap-x-3">
                {post.matePostPets && post.matePostPets.length > 0 ? (
                  post.matePostPets.map((pet) => (
                    <div className="w-48 rounded-md border border-gray-200 bg-gray-100 p-4 shadow-lg" key={pet.id}>
                      <p>성별: {pet.male_female === "male" ? "남" : pet.male_female === "female" ? "여" : ""}</p>
                      <p>중성화 여부: {pet.neutered ? "예" : pet.neutered === false ? "아니오" : ""}</p>
                      <p>나이: {pet.age ? `${pet.age}살` : ""}</p>
                      <p>무게: {pet.weight ? `${pet.weight} kg` : ""}</p>
                      <p>성격: {pet.characteristics || ""}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex w-full items-center justify-center rounded-md bg-gray-200 p-4 text-gray-600">
                    반려동물 정보가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailMatePost;
