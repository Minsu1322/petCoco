"use Client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import PetItem from "./petItem";
import Button from "@/components/Button";
import { useState } from "react";
import { formatDateTimeTitle, formatDateTimeContent } from "@/app/utils/getConvertTime";
import { EmblaOptionsType } from "embla-carousel";

import { MatePostAllType } from "@/types/mate.type";
import PetCarousel from "../../_components/petCarousel/petCarousel";

interface DetailViewProps {
  post: MatePostAllType;
  userId: string;
  handleEditPost: () => void;
  handleDeletePost: (id: string) => void;
  handleTogglePost: (id: string) => void;
  startChat: () => void;
}
const DynamicMapComponent = dynamic(() => import("@/app/(public)/mate/_components/map/mapDetail"), { ssr: false });

const DetailView = ({
  post,
  userId,
  handleEditPost,
  handleDeletePost,
  handleTogglePost,
  startChat
}: DetailViewProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    console.log("toggleMenu called");
    setIsMenuOpen(!isMenuOpen);
  };

  const OPTIONS: EmblaOptionsType = { align: "start", dragFree: true, loop: true };
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  return (
    <div className="mx-[1rem] mt-[1.06rem]">
      {/* 제목 및 버튼 영역 */}
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className="flex flex-col">
            {userId === post.user_id && (
              <div className="mb-[0.5rem] flex justify-end gap-x-[0.625rem]">
                <button onClick={handleEditPost} className="text-sm text-gray-700 hover:text-mainColor">
                  수정
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-sm text-gray-700 hover:text-mainColor"
                >
                  삭제
                </button>
                <button
                  onClick={() => handleTogglePost(post.id)}
                  className="text-sm text-gray-700 hover:text-mainColor"
                >
                  모집상태 변경
                </button>
              </div>
            )}
            <h1 className="mx-auto text-[1.125rem] font-semibold">
              [{post.date_time ? formatDateTimeTitle(post.date_time) : ""}] {post.title}
            </h1>
          </div>

          {/* 프로필 영역 */}
          <div className="mt-[1.5rem]">
            <DynamicMapComponent
              center={{
                lat: Number(post.position?.center?.lat),
                lng: Number(post.position?.center?.lng)
              }}
              tag={post.place_name || ""}
              // onMapLoad={() => setIsMapLoading(false)}
            />
          </div>
          <div className="mb-[0.69rem] mt-[0.5rem] flex items-center">
            <img src="/assets/svg/ic_info.svg" />
            <p className="ml-[0.5rem] text-[0.75rem] text-gray-400">상세 위치는 참여 확정 후 확인할 수 있어요</p>
          </div>
          <div className="mb-[0.94rem] mt-[0.69rem] flex rounded-[0.75rem] border border-[#C2C0BD] px-[0.69rem] py-[0.75rem]">
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
                className="ml-[0.75rem] mt-[0.56rem] flex flex-shrink-0 flex-col items-center justify-center rounded-full bg-mainColor px-[0.81rem] py-[0.19rem] text-[1rem] text-white"
                onClick={startChat}
                text="채팅하기"
              ></Button>
            </div>
            <div className="flex flex-col justify-center">
              <p className="flex font-semibold">
                {post.users?.nickname} ({post.users?.gender}, {post.users?.age})
              </p>
              <div className="flex flex-col">
                <p className="mr-[0.5rem] text-gray-400">한 마디</p>
                <p className="whitespace-wrap flex w-[170px] overflow-hidden text-ellipsis font-semibold">
                  {post.content}
                </p>
              </div>
            </div>
          </div>
          <div className="border-b border-t border-gray-200 pb-[0.94rem] pl-[0.75rem] pt-[0.87rem]">
            <div className="mb-[0.25rem] flex">
              <img src="/assets/svg/ic_location2.svg" />
              <p className="ml-[0.5rem] w-[170px] overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                {post.place_name || ""}
              </p>
            </div>
            <div className="mb-[0.25rem] flex">
              <img src="/assets/svg/ic_calendar2.svg" />
              <p className="ml-[0.5rem] text-sm">
                {/* {post.date_time?.split("T")[0]} | {getConvertTime({ date_time: post.date_time || "" })} */}
                {formatDateTimeContent(post.date_time)}
              </p>
            </div>
            <div className="flex items-center">
              <img src="/assets/svg/ic_user2.svg" className="mr-[0.5rem]" />
              <p className="mr-[0.5rem] flex text-sm">{post.members}명 모집</p>
              <div
                className={`${post.recruiting ? "bg-[#7BC868]" : "bg-bgGray400"} flex items-center justify-center rounded-full px-[0.62rem] py-[0.12rem]`}
              >
                <p className="text-[0.625rem]">{post.recruiting ? "모집중" : "모집 완료"}</p>
              </div>
            </div>
          </div>

          <div className="mb-[0.87rem] ml-[0.75rem] mt-[0.37rem] flex items-center">
            <img src="/assets/svg/ic_info.svg" />
            <p className="ml-[0.5rem] text-[0.75rem] text-gray-400">우천 시 일정이 변경되거나 취소될 수 있어요.</p>
          </div>
          {/* <div className="flex gap-x-[1rem] overflow-x-auto whitespace-nowrap scrollbar-hide "> 
        {post.matepostpets?.map((pet) => <PetItem key={pet.id} pet={pet} />)}
        </div> */}
          <div className="flex">
            {post.matepostpets && post.matepostpets.length > 0 && <PetCarousel pets={post.matepostpets} slides={SLIDES} options={OPTIONS} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
