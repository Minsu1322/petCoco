"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/zustand/useAuth";
import { MatePostAllTypeForItem, MatePostFullType } from "@/types/mate.type";
import Link from "next/link";
import { formatDateTimeContent, getConvertTime } from "@/app/utils/getConvertTime";
import Image from "next/image";

type MatePostItemPorps = MatePostAllTypeForItem;

const MyMate = () => {
  const { user } = useAuthStore();
  const userId = user?.id;
  const extractDong = (address: string) => {
    const match = address?.match(/(\S+(?:동\d*가?|읍|면))(?=\s|$)/);
    return match ? match[0] : "";
  };

  const { data, isPending, error } = useQuery<MatePostItemPorps[]>({
    queryKey: ["myMatePosts", userId],
    queryFn: async () => {
      const response = await fetch(`/api/mypage/${userId}/myMate`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!userId
  });

  if (isPending) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div>
      <div className="my-3 text-center font-semibold">나의 산책메이트</div>
      {data.map((post) => (
        <div key={post.id}>
          <div className="mx-[1.5rem] mb-5 flex flex-col rounded-xl border border-gray-300 pb-[1rem] pt-[0.88rem] shadow-custom">
            <Link href={`/mate/posts/${post.id}`}>
              {/* <div className="flex justify-between px-[1rem]">
                <p className="flex items-center text-xs text-gray-400">{post.created_at.split("T")[0]}</p>
                {post.distance !== null && (
                  <p className="flex items-center text-xs text-gray-400">
                    현위치에서 {post.distance.toFixed(1)}km 거리
                  </p>
                )}
              </div> */}
              <div className="mt-[0.75rem] flex">
                <div className="ml-[2.4rem] mr-[2.28rem] mt-[0.5rem] flex flex-col items-center">
                  <div className="flex h-[3.75rem] w-[3.75rem]">
                    <Image
                      src={
                        post.users[0]?.profile_img ||
                        "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/post_image/1722324396777_xo2ka9.jpg"
                      }
                      alt="사용자 프로필 이미지"
                      width={60}
                      height={60}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <div className="mt-[0.44rem] flex items-center justify-center rounded-full bg-gray-100 px-[0.75rem] py-[0.12rem]">
                    <p className="w-15 overflow-hidden text-ellipsis whitespace-nowrap text-[0.625rem] text-mainColor">
                      {post.users[0]?.nickname}
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-col justify-center">
                  <p className="mb-[0.38rem] w-[170px] overflow-hidden text-ellipsis whitespace-nowrap text-[1.125rem] font-semibold">
                    {post.title}
                  </p>
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
                      className={`${post.recruiting ? "bg-[#11BBB0]" : "bg-bgGray400"} flex items-center justify-center rounded-full px-[0.62rem] py-[0.12rem] text-white`}
                    >
                      <p className="text-[0.625rem]">{post.recruiting ? "모집중" : "모집 완료"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <div className="mx-auto mt-[0.88rem] flex items-center">
              {/* <Button
				className="ml-[8.19rem] mr-[0.97rem] flex flex-shrink-0 flex-col items-center justify-center rounded-full bg-mainColor text-white px-[3.88rem] py-[0.5rem]"
				onClick={startChat}
				text="채팅하기"
			  ></Button> */}
              {/* <Link
				  className="flex flex-shrink-0 flex-col items-center justify-center rounded-full bg-gray-300 p-2.5 px-[2.25rem] py-[0.5rem]"
				  href={`/mate/posts/${post.id}`}
				>자세히 보기</Link> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyMate;
