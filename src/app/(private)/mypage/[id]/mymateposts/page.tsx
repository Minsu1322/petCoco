"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/zustand/useAuth";
import { MatePostFullType } from "@/types/mate.type";
import Link from "next/link";
import { getConvertTime } from "@/app/utils/getConvertTime";

const MyMate = () => {
  const { user } = useAuthStore();
  const userId = user?.id;
  const extractDong = (address: string) => {
    const match = address?.match(/(\S+(?:동\d*가?|읍|면))(?=\s|$)/);
    return match ? match[0] : "";
  };

  const { data, isPending, error } = useQuery<MatePostFullType[]>({
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
      {data.map((data) => (
        <Link
          key={data.id}
          href={`/mate/posts/${data.id}`}
          className="ml-3 mt-5 flex flex-col items-center justify-center"
        >
          <div className="flex-grow pr-5">
            <p className="mb-3 text-xl font-semibold">{data.title}</p>
            <p className="mb-3 h-24 overflow-hidden overflow-ellipsis whitespace-nowrap">{data.content}</p>
            <div className="mt-3 flex flex-row justify-between">
              {/* <p>{data.users.nickname}</p> */}
              <div className="flex flex-row gap-x-5">
                <p className="w-28 overflow-hidden text-ellipsis whitespace-nowrap text-end">
                  {`${extractDong(data.address || "")}, ${data.place_name || ""}`}
                </p>
                <p>
                  {data.date_time?.split("T")[0]} | {getConvertTime({ date_time: data.date_time || "" })}
                </p>
                <p>{data.members}명 모집</p>
              </div>
            </div>
          </div>
          {/* <div>
            <img src={"사용자 프로필 이미지"} alt="사용자 프로필 이미지" width={140} height={140} />
          </div> */}
        </Link>
      ))}
    </div>
  );
};

export default MyMate;
