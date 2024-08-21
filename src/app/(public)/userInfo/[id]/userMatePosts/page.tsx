"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/zustand/useAuth";
import { MatePostAllType } from "@/types/mate.type";
import Link from "next/link";
import { formatDateTimeContent } from "@/app/utils/getConvertTime";
import Image from "next/image";
import LoadingComponent from "@/components/loadingComponents/Loading";
import { useParams, useRouter } from "next/navigation";

type MatePostItemPorps = MatePostAllType;

const UserMate = () => {
  // const { user } = useAuthStore();
  // const userId = user?.id;
  const params = useParams();
  const router = useRouter();

  const id = params?.id || 0;

  // function toUserInfo() {
  //   router.push(`/userInfo/${id}`);
  // }

  // const extractDong = (address: string) => {
  //   const match = address?.match(/(\S+(?:동\d*가?|읍|면))(?=\s|$)/);
  //   return match ? match[0] : "";
  // };

  const { data, isPending, error } = useQuery<MatePostItemPorps[]>({
    queryKey: ["myMatePosts", id],
    queryFn: async () => {
      const response = await fetch(`/api/mypage/${id}/myMate`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }
  });

  if (isPending) {
    return (
      <div>
        <LoadingComponent />
      </div>
    );
  }
  if (error)
    return (
      <div>
        <LoadingComponent />
      </div>
    );

  return (
    <div>
      <div className="my-3 text-center font-semibold">유저의 산책메이트</div>
      {data.map((post) => (
        <div className="my-3 px-[1.5rem]" key={post.id}>
          <div className="w-full rounded-[0.75rem] border px-4 py-[0.75rem] shadow-custom">
            <Link href={`/mate/posts/${post.id}`}>
              <div className="flex items-center justify-between text-[0.625rem] text-[#A9A7A2]">
                <p className="">{post.created_at.split("T")[0]}</p>
              </div>
              <div className="mt-[0.5rem] flex justify-around">
                <div className="mt-4 flex flex-col items-center gap-[0.5rem]">
                  <div className="h-[3.75rem] w-[3.75rem] shrink">
                    <Image
                      src={
                        post.users?.profile_img ||
                        "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/post_image/1722324396777_xo2ka9.jpg"
                      }
                      alt="사용자 프로필 이미지"
                      width={60}
                      height={60}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="w-[170px] overflow-hidden text-ellipsis whitespace-nowrap text-[1.125rem] font-semibold">
                    {post.title}
                  </p>
                  <div className="flex flex-col gap-y-[0.25rem]">
                    <div className="mt-[0.37rem] flex gap-[0.5rem]">
                      <Image src="/assets/svg/ic_location2.svg" alt="위치 아이콘" width={20} height={20} priority />
                      <p className="text-4 w-[170px] overflow-hidden text-ellipsis whitespace-nowrap text-[#444447]">
                        {post.place_name || ""}
                      </p>
                    </div>
                    <div className="text-4 flex gap-[0.5rem] text-[#444447]">
                      <Image src="/assets/svg/ic_calendar2.svg" alt="달력 아이콘" width={20} height={20} priority />
                      <p className=""> {formatDateTimeContent(post.date_time)} </p>
                    </div>
                    <div className="flex gap-[0.5rem]">
                      <Image src="/assets/svg/ic_user2.svg" alt="사용자 아이콘" width={20} height={20} priority />
                      <p className="">{post.members}명 모집</p>
                      <div className={`${post.recruiting ? "bg-[#11BBB0]" : "bg-bgGray400"} rounded-full`}>
                        <p className="px-[0.62rem] py-[0.12rem] text-[0.875rem] text-white">
                          {post.recruiting ? "모집중" : "모집 완료"}
                        </p>
                      </div>
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
      {/* <div className="pb-[80px] pt-[30px]">
        <button
          className="w-full rounded-lg bg-[#8E6EE8] py-3 text-center text-[16px] font-semibold text-[#FFFFFF]"
          onClick={toUserInfo}
        >
          뒤로가기
        </button>
      </div> */}
    </div>
  );
};

export default UserMate;
