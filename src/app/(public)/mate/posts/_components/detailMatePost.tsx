"use client";

import { MateNextPostType, MatePostAllType, Pets } from "@/types/mate.type";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { locationStore } from "@/zustand/locationStore";
import { getConvertAddress } from "../../getConvertAddress";
// import { getConvertTime } from "@/app/utils/getConvertTime";
// import { getConvertDate } from "../../_components/getConvertDate";
import { useAuthStore } from "@/zustand/useAuth";
import { createClient } from "@/supabase/client";
import Swal from "sweetalert2";
import DetailView from "./detailView";
import PetEdit from "../../_components/post/pet/petEdit";

interface DetailMatePostProps {
  post: MatePostAllType;
}

// 동적 로딩 설정
const DynamicMapEditComponent = dynamic(() => import("@/app/(public)/mate/_components/map/mapEdit"), { ssr: false });

const DetailMatePost = ({ post }: DetailMatePostProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user && user.id;
  const router = useRouter();
  const supabase = createClient();
  // const [isMapLoading, setIsMapLoading] = useState(true);

  const { position, setPosition } = locationStore();

  const initialState: Omit<MateNextPostType, "user_id" | "position"> = {
    title: post.title || "",
    content: post.content || "",
    // position: { center: { lat: 37.5556236021213, lng: 126.992199507869 }, errMsg: null, isLoading: true },
    date_time: post.date_time || "",
    members: post.members || "",
    recruiting: post.recruiting || true,
    address: post.address || "",
    place_name: post.place_name || "",
    location: post.location || "",
    pet_id: post.pet_id || []
  };

  // const initialPetState: Pets = {
  //   userId,
  //   pet_id: []
  // };

  const [formPosts, setFormPosts] = useState<Omit<MateNextPostType, "user_id" | "position">>(initialState);
  // const [formPets, setFormPets] = useState<Pets[]>([initialPetState]);

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
    position,
    location: `POINT(${position.center.lng} ${position.center.lat})`
  };

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/mate/post/${post.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // router.replace("/mate");
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

      setIstEditting(true);
    } catch (error) {
      console.error(error);
    }
  };

  const togglePost = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: `${post.recruiting ? "모집 완료하시겠습니까?" : "모집 중으로 변경하시겠습니까?"}`,
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
        confirmButtonColor: "#1763e7",
        cancelButtonColor: "#c0c0c0",
        icon: "question"
      });

      if (result.isConfirmed) {
        Swal.fire("완료!", "모집 상태가 변경되었습니다!", "success");

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
      } else if (result.isDenied) {
        Swal.fire("오류!", "모집상태가 변경되지 않았습니다.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("오류!", "모집상태가 변경되지 않았습니다.", "error");
    }
  };

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
      Swal.fire({
        title: "완료!",
        text: "게시글 삭제가 완료되었습니다.",
        icon: "success"
      })
      router.replace("/mate");
    },
    onError: (error) => {
      console.error("삭제 중 오류 발생:", error);
      Swal.fire({
        title: "오류가 발생했습니다!",
        text: "게시글 삭제에 실패했습니다.",
        icon: "error"
      });
    }
  });

  const editMutation = useMutation({
    mutationFn: (id: string) => editPost(id),
    onMutate: async (newPost) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["matePosts"] });

      // 이전 데이터 스냅샷
      const previousPosts = queryClient.getQueryData<MatePostAllType[]>(["matePosts"]);

      // 옵티미스틱 업데이트
      queryClient.setQueryData<MatePostAllType[]>(["matePosts"], (old) => {
        if (!old) return [updatePost as MatePostAllType];
        return old.map((post) => (post.id === newPost ? { ...post, ...updatePost } : post));
      });

      // 이전 데이터 반환 (롤백을 위해)
      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousPosts) {
        queryClient.setQueryData<MatePostAllType[]>(["matePosts"], context.previousPosts);
      }
      console.error("수정 중 오류 발생:", err);
      Swal.fire({
        title: "오류가 발생했습니다!",
        text: "게시글 수정에 실패했습니다.",
        icon: "error"
      });
    },
    onSuccess: () => {
      Swal.fire({
        title: "완료!",
        text: "게시글 수정이 완료되었습니다.",
        icon: "success"
      });
      setIstEditting(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => togglePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
    }
  });

  const handleDeletePost = (id: string) => {
    Swal.fire({
      title: "게시글 삭제",
      text: "현재 게시글을 삭제하시겠어요?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#c0c0c0",
      confirmButtonText: "삭제",
      cancelButtonText: "취소"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleUpdatePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editMutation.mutate(post.id);
  };

  const handleEditPost = () => {
    Swal.fire({
      title: "게시글 수정",
      text: "현재 게시글을 수정하시겠어요?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1763e7",
      cancelButtonColor: "#c0c0c0",
      confirmButtonText: "확인",
      cancelButtonText: "취소"
    }).then((result) => {
      if (result.isConfirmed) {
        setIstEditting(true);
      }
    });
  };

  const handleTogglePost = (id: string) => {
    toggleMutation.mutate(id);
    setIstEditting(false);
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

  // console.log(formPosts)

  return (
    <div className="container min-h-screen">
      {isEditing ? (
        <form onSubmit={handleUpdatePost} className="flex flex-col">
          {/* 소개 부분 */}
          <div className="mt-[2.69rem] flex flex-col px-[1.5rem]">
            <h1 className="mb-[1rem] text-[2rem] font-[600]">글 수정하기</h1>
            <div className="text-[1rem] font-[500]">
              <p>수정 후 수정 완료 버튼을 눌러주세요.</p>
            </div>
          </div>
          {/* 제목, 산책 일시, 모집 인원 수 */}
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
                placeholder="0명"
                className="rounded-[0.5rem] border border-subTitle2 p-[0.75rem]"
                value={formPosts.members || ""}
                onChange={(e) => setFormPosts({ ...formPosts, members: e.target.value })}
              />
            </div>
          </div>
          {/* 산책 장소 */}
          <div className="mb-[1rem] mt-[1.94rem] flex flex-col gap-y-[0.5rem] px-[1.5rem]">
            <label className="text-[1rem] font-[500]">산책 장소</label>
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
          {/* 내용 */}
          <div className="mb-[1rem] mt-[1.06rem] flex flex-col gap-y-[0.5rem] px-[1.5rem]">
            <label htmlFor="content" className="text-[1rem] font-[600]">
              내용
            </label>
            <textarea
              value={formPosts.content || ""}
              onChange={(e) => setFormPosts({ ...formPosts, content: e.target.value })}
              placeholder="선호하는 산책 동선이나 총 예상 산책 시간, 혹은 특별한 요구 사항이 있다면 적어주세요."
              className="h-[6.0625rem] w-full resize-none rounded-[0.5rem] border border-subTitle2 p-[0.75rem]"
              id="content"
              maxLength={199}
            ></textarea>
            <p className="flex justify-end text-subTitle2">{formPosts.content?.length}/200</p>
          </div>
          <PetEdit post={post} setFormPosts={setFormPosts} userId={userId} />
          <div className="mb-[2rem] mt-[2rem] flex flex-col gap-y-[0.5rem]">
            <div className="flex w-full items-center justify-center px-[1.5rem]">
              <button
                className="w-full cursor-pointer rounded-full bg-mainColor px-[1.5rem] py-[0.75rem] text-white"
                type="submit"
              >
                수정 완료
              </button>
            </div>
            <div className="mb-[5.5rem] flex w-full items-center justify-center px-[1.5rem]">
              <button
                className="w-full cursor-pointer rounded-full border border-mainColor px-[1.5rem] py-[0.75rem] text-mainColor"
                type="button"
                onClick={handleResetEditPost}
              >
                수정 취소
              </button>
            </div>
          </div>
        </form>
      ) : (
        <DetailView
          post={post}
          userId={userId}
          handleEditPost={handleEditPost}
          handleDeletePost={handleDeletePost}
          handleTogglePost={handleTogglePost}
          // startChat={startChat}
        />
      )}
    </div>
  );
};

export default DetailMatePost;
