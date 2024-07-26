"use client";

import { MateNextPostType, MatePostAllType, MatePostFullType, MatePostPetsType } from "@/types/mate.type";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { locationStore } from "@/zustand/locationStore";
import { getConvertAddress } from "../../getConvertAddress";
import { useAuthStore } from "@/zustand/useAuth";

interface DetailMatePostProps {
  post: MatePostAllType;
}

// 동적 로딩 설정
const DynamicMapComponent = dynamic(() => import("@/app/(public)/mate/_components/mapDetail"), { ssr: false });
const DynamicMapEditComponent = dynamic(() => import("@/app/(public)/mate/_components/mapEdit"), { ssr: false });

const DetailMatePost = ({ post }: DetailMatePostProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user.id;
  const router = useRouter();

  const time = post.date_time?.split("T")[1].split(":");
  const convertPeriod = time && (Number(time[0]) < 12 ? "오전" : "오후");
  const convertHour = time && (Number(time[0]) % 12 || 12);
  const convertMin = time && time[1];

  const { position, setPosition } = locationStore();

  const initialState: Omit<MateNextPostType, "user_id" | "position"> = {
    title: post.title || "",
    content: post.content  ||  "",
    // position: { center: { lat: 37.5556236021213, lng: 126.992199507869 }, errMsg: null, isLoading: true },
    date_time: post.date_time  ||  "",
    members: post.members  ||  "",
    recruiting: post.recruiting || true,
    recruitment_period: post.recruitment_period  ||  "",
    address: post.address  || "",
    place_name:  post.place_name  || "",
    preferred_route:  post.preferred_route  || "",
    special_requirements:  post.special_requirements  ||  ""
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
    position,
  };

  // TODO: 작성자에게만 이 버튼이 보이도록 수정 ✅
  const deletePost = async (id: string) => {
    if (confirm("현재 게시글을 삭제하시겠어요?")) {
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
    }
  };

  const editPost = async (id: string) => {
    if (confirm("현재 게시글을 수정하시겠어요?")) {
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
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
      alert("삭제가 완료되었습니다.");
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
    deleteMutation.mutate(id);
  };

  const handleUpdatePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지
    editMutation.mutate(post.id);
  };

  const handleEditPost = () => {
    setIstEditting(true);
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
    <div className="px-5 pb-5">
      <Link href="/mate">
        <div className="flex h-10 w-20 cursor-pointer items-center justify-center rounded-md bg-mainColor p-1">
          뒤로가기
        </div>
      </Link>
      {isEditing ? (
       <form onSubmit={handleUpdatePost} className="flex flex-col">
       <div className="flex flex-col">
         <input
           type="text"
           value={formPosts.title || ""}
           onChange={(e) => setFormPosts({ ...formPosts, title: e.target.value })}
           placeholder=" 제목을 입력해 주세요"
           className="w-[300px] rounded-md border border-gray-300"
         />
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
          <div className="flex flex-row gap-x-3">
            <button
              className="mt-3 flex h-10 w-20 cursor-pointer items-center justify-center rounded-md bg-mainColor p-1"
              type="submit"
            >
              수정 완료
            </button>
            <button
              className="mt-3 flex h-10 w-20 cursor-pointer items-center justify-center rounded-md bg-mainColor p-1"
              type="button"
              onClick={handleResetEditPost}
            >
              수정 취소
            </button>
          </div>
        </div>
        </form>
      ) : (
        <div className="mt-3">
          <p>{post.title}</p>
          <div className="flex w-4/12 flex-row justify-between">
            <p>{post.content}</p>
            <p>작성자 {post.users?.nickname}</p>
          </div>
          <br />
          <p>모집인원 수 : {post.members}명</p>
          <p>
            모집기간 : {post.date_time?.split("T")[0]}~{post.recruitment_period?.split("T")[0]}
          </p>
          <p className="mt-5">🐾 산책 장소 관련 정보</p>
          <p>산책 장소 : {post.place_name}</p>
          <p>산책 날짜 : {post.date_time?.split("T")[0]}</p>
          <p>산책 시간 : {`${convertPeriod} ${convertHour}시 ${convertMin}분`}</p>
          <div>
            <DynamicMapComponent
              center={{
                lat: Number(post.position?.center?.lat),
                lng: Number(post.position?.center?.lng)
              }}
            />
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
          {userId === post.user_id && (
            <div className="mt-5 flex flex-row gap-10">
              <button
                className="mt-3 flex h-10 w-20 cursor-pointer items-center justify-center rounded-md bg-mainColor p-1"
                onClick={() => handleDeletePost(post.id)}
              >
                삭제
              </button>
              <button
                className="mt-3 flex h-10 w-20 cursor-pointer items-center justify-center rounded-md bg-mainColor p-1"
                onClick={handleEditPost}
              >
                수정
              </button>
              <button
                className="mt-3 flex h-10 w-28 cursor-pointer items-center justify-center rounded-md bg-mainColor p-1"
                onClick={() => handleTogglePost(post.id)}
              >
                모집상태 변경
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailMatePost;
