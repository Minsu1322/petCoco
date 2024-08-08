"use client";

import { MateNextPostType, MatePostAllType } from "@/types/mate.type";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { locationStore } from "@/zustand/locationStore";
import { getConvertAddress } from "../../getConvertAddress";
import { getConvertTime } from "@/app/utils/getConvertTime";
import { getConvertDate } from "../../_components/getConvertDate";
import { useAuthStore } from "@/zustand/useAuth";
import { createClient } from "@/supabase/client";
import Swal from "sweetalert2";
import Button from "@/components/Button";
import PetItem from "../../_components/petItem";

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
        title: "모집 상태를 변경하시겠어요?",
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
      router.replace("/mate");
      Swal.fire({
        title: "완료!",
        text: "게시글 삭제가 완료되었습니다.",
        icon: "success"
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["matePosts"] });
      });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
      // alert("수정이 완료되었습니다.");
      Swal.fire({
        title: "완료!",
        text: "게시글 수정이 완료되었습니다.",
        icon: "success"
      });
      setIstEditting(false);
    },
    onError: (error) => {
      console.error("수정 중 오류 발생:", error);
      // alert("수정 중 오류가 발생했습니다.");
      Swal.fire({
        title: "오류가 발생했습니다!",
        text: "게시글 수정에 실패했습니다.",
        icon: "error"
      });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => togglePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matePosts"] });
      // Swal.fire({
      //   title: "완료!",
      //   text: "모집 상태가 변경되었습니다",
      //   icon: "success"
      // });
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
    e.preventDefault(); // 폼 제출 기본 동작 방지
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

  const startChat = async () => {
    if (!user) {
      // alert("로그인이 필요합니다.");
      Swal.fire({
        title: "로그인이 필요합니다!",
        text: "1:1 대화를 하려면 로그인이 필요합니다.",
        icon: "warning"
      });
      router.replace("/signin");
      return;
    }

    try {
      // 채팅방이 이미 존재하는지 확인
      const { data: existingChat, error: chatError } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${post.user_id},receiver_id.eq.${post.user_id}`)
        .limit(1);

      if (chatError) throw chatError;

      if (existingChat && existingChat.length > 0) {
        // 이미 채팅방이 존재하면 해당 채팅방으로 이동
        router.push(`/message?selectedUser=${post.user_id}`);
      } else {
        // 새로운 채팅방 생성
        const { error: insertError } = await supabase.from("messages").insert([
          {
            sender_id: user.id,
            receiver_id: post.user_id,
            content: "채팅이 시작되었습니다."
          }
        ]);

        if (insertError) throw insertError;

        // 새로 생성된 채팅방으로 이동
        router.push(`/message?selectedUser=${post.user_id}`);
      }
    } catch (error) {
      console.error("채팅 시작 오류:", error);
      // alert("채팅을 시작하는 데 문제가 발생했습니다. 다시 시도해 주세요.");
      Swal.fire({
        title: "채팅 시작 오류",
        text: "채팅을 시작하는 데 문제가 발생했습니다. 다시 시도해 주세요.",
        icon: "warning"
      });
    }
  };

  return (
    <div className="container mx-auto">
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
        <div className="mx-[1rem] mb-5 mt-[1.06rem]">
          {/* 제목 및 버튼 영역 */}
          <div className="mb-1 flex flex-col">
            <div className="flex flex-col">
              <div className="mt-3 flex justify-between">
                <h1 className="mx-auto text-[1.125rem] font-semibold">
                  [{post.date_time}]{post.title}
                </h1>
                {/* <div>
                  {userId === post.user_id ? (
                    <div className="mb-4 flex item-center gap-x-5">
                      <button
                        onClick={handleEditPost}
                        className="flex h-10 w-16 cursor-pointer items-center justify-center rounded-md bg-editBtnColor p-2"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="flex h-10 w-16 cursor-pointer items-center justify-center rounded-md bg-delBtnColor p-2"
                      >
                        삭제
                      </button>
                      <button
                        onClick={() => handleTogglePost(post.id)}
                        className="flex h-10 w-32 cursor-pointer items-center justify-center rounded-md bg-gray-200 p-2"
                      >
                        모집상태 변경
                      </button>
                    </div>
                  ) : (
                    <div className="mb-4 flex item-center gap-x-5">
                    <button
                        onClick={startChat}
                        className="flex h-8 w-20 lg:h-10 lg:w-28 cursor-pointer items-center justify-center rounded-md bg-gray-200 p-2"
                      >
                        1:1대화
                      </button>
                      </div>
                  )}
                </div> */}
              </div>

              {/* 프로필 영역 */}
              <div className=" mt-[1.5rem]">
                <DynamicMapComponent
                  center={{
                    lat: Number(post.position?.center?.lat),
                    lng: Number(post.position?.center?.lng)
                  }}
                  tag={post.place_name || ""}
                  // onMapLoad={() => setIsMapLoading(false)}
                />
              </div>
              <div className="mt-[0.5rem] flex items-center mb-[0.69rem]">
                <img src="/assets/svg/ic_info.svg" />
                <p className="ml-[0.5rem] text-[0.75rem] text-gray-400">상세 위치는 참여 확정 후 확인할 수 있어요</p>
              </div>
              <div className="mb-[0.94rem] mt-[0.69rem] flex rounded-[0.75rem] bg-gray-100 px-[0.69rem] py-[0.75rem]">
                <div className="mr-[2.16rem] flex flex-col">
                  <div className="ml-[1.34rem] h-[3.75rem] w-[3.75rem]">
                    <Image
                      src={
                        post.users && post.users?.profile_img
                          ? post.users?.profile_img
                          : "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/post_image/1722324396777_xo2ka9.jpg"
                      }
                      alt="사용자 프로필 이미지"
                      width={60}
                      height={60}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <Button
                    className="ml-[0.75rem] mt-[0.56rem] flex flex-shrink-0 flex-col items-center justify-center rounded-full bg-gray-400 px-[0.81rem] py-[0.19rem] text-[1rem] text-white"
                    onClick={startChat}
                    text="채팅하기"
                  ></Button>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="flex font-semibold">
                    {post.users?.nickname} ({post.users?.gender}, {post.users?.age})
                  </p>
                  <div className="flex">
                    <p className="mr-[0.5rem] text-gray-400">한 마디</p>
                    <p className="flex w-[130px] overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                      {post.users?.introduction}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 pt-[0.87rem] pb-[0.94rem] pl-[0.75rem]">
                <div className="mb-[0.25rem] flex">
                  <img src="/assets/svg/ic_location2.svg" />
                  <p className="ml-[0.5rem] w-[170px] overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                    {post.place_name || ""}
                  </p>
                </div>
                <div className="mb-[0.25rem] flex">
                  <img src="/assets/svg/ic_calendar2.svg" />
                  <p className="ml-[0.5rem] text-sm">
                    {post.date_time?.split("T")[0]} | {getConvertTime({ date_time: post.date_time || "" })}
                  </p>
                </div>
                <div className="flex items-center">
                  <img src="/assets/svg/ic_user2.svg" className="mr-[0.5rem]" />
                  <p className="mr-[0.5rem] flex text-sm">{post.members}명 모집</p>
                  <div
                    className={`${post.recruiting ? "bg-[#7BC868]" : "bg-[#F47BB5]"} flex items-center justify-center rounded-full px-[0.62rem] py-[0.12rem]`}
                  >
                    <p className="text-[0.625rem]">{post.recruiting ? "모집중" : "모집 완료"}</p>
                  </div>
                </div>
              </div>

              <div className="ml-[0.75rem] mt-[0.37rem] flex items-center mb-[0.87rem]">
                <img src="/assets/svg/ic_info.svg" />
                <p className="ml-[0.5rem] text-[0.75rem] text-gray-400">우천 시 일정이 변경되거나 취소될 수 있어요.</p>
              </div>

              <div className="flex">
                {/* <div className="space-y-8 p-6"> */}
                  {/* 희망 날짜/시간 및 모집 인원 */}
                  {/* <div className="flex rounded-lg bg-gray-50 p-4">
                    <div className="w-3/6">
                      <p className="text-sm text-gray-500">희망 날짜 및 시간</p>
                      <p className="mt-1 font-semibold">
                        {post.date_time?.split("T")[0]} {getConvertTime({ date_time: post.date_time || "" })}
                      </p>
                    </div>
                    <div className="ml-8">
                      <p className="text-sm text-gray-500">모집 인원 수</p>
                      <p className="mt-1 font-semibold">{post.members}명</p>
                    </div>
                  </div>

                  {/* 모집기간 */}
                  {/* <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">모집기간</p>
                    <p className="mt-1 font-semibold">
                      {post.recruitment_start?.split("T")[0]}{" "}
                      {getConvertTime({ date_time: post.recruitment_start || "" })}
                      {" ~ "}
                      {post.recruitment_end?.split("T")[0]} {getConvertTime({ date_time: post.recruitment_end || "" })}
                    </p>
                  </div>  */}
                  {/* 산책 장소 정보 */}
                  {/* <div className="flex flex-col gap-6 md:flex-row">
                    <div className="w-full md:w-1/2">
                      <p className="mb-2 font-semibold">산책 장소</p>
                      <div className="overflow-hidden rounded-lg shadow-md">
                        {/* {isMapLoading && <div className="h-[300px] w-full animate-pulse bg-gray-200"></div>} */}
                      {/* </div>
                    </div>
                    <div className="mt-7 w-full space-y-4 rounded-lg bg-gray-50 p-4 md:w-1/2">
                      <div>
                        <p className="text-sm text-gray-500">만나기로 한 곳의 주소</p>
                        <p className="mt-1 font-semibold">{post.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">산책 장소 추가 설명</p>
                        <p className="font-semibold">{post.place_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">선호하는 산책 루트</p>
                        <p className="mt-1 font-semibold">{post.preferred_route}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">특별한 요구사항</p>
                        <p className="mt-1 font-semibold">{post.special_requirements}</p>
                      </div>
                    </div>
                  </div> */} 

                  {/* 내용 */}
                  {/* <div>
                    <p className="whitespace-pre-line rounded-lg bg-gray-50 p-4">{post.content}</p>
                  </div> */}

                  {/* 반려동물 정보 */}
                  {/* <div>
                    <div className="mb-3 flex items-center">
                      <span className="mr-2 text-3xl">🐶</span>
                      <h2 className="text-lg font-semibold">반려동물 정보</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {post.matepostpets && post.matepostpets.length > 0 ? (
                        post.matepostpets.map((pet) => (
                          <div className="rounded-lg bg-gray-50 p-4 shadow-sm" key={pet.id}>
                            <p className="mb-2">
                              <span className="font-semibold">성별:</span>{" "}
                              {pet.male_female === "male" ? "남" : pet.male_female === "female" ? "여" : ""}
                            </p>
                            <p className="mb-2">
                              <span className="font-semibold">중성화 여부:</span>{" "}
                              {pet.neutered ? "예" : pet.neutered === false ? "아니오" : ""}
                            </p>
                            <p className="mb-2">
                              <span className="font-semibold">나이:</span> {pet.age ? `${pet.age}살` : ""}
                            </p>
                            <p className="mb-2">
                              <span className="font-semibold">무게:</span> {pet.weight ? `${pet.weight} kg` : ""}
                            </p>
                            <p>
                              <span className="font-semibold">성격 및 특징:</span> {pet.characteristics || ""}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full flex items-center justify-center rounded-lg bg-gray-100 p-4 text-gray-500">
                          반려동물 정보가 없습니다.
                        </div>
                      )}
                    </div>
                  </div> */}
                {/* </div> */}
                <PetItem />
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailMatePost;
