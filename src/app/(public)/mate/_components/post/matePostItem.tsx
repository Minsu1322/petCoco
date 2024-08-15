import { MatePostAllTypeForItem } from "@/types/mate.type";
import Link from "next/link";
import Image from "next/image";
// import { getDistanceHaversine } from "../../getDistanceHaversine";
// import { locationStore } from "@/zustand/locationStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/useAuth";
import { createClient } from "@/supabase/client";
import { formatDateTimeContent } from "@/app/utils/getConvertTime";
import Swal from "sweetalert2";
import Chip from "@/components/Chip";
import Button from "@/components/Button";
import startChat from "@/app/utils/startChat";

interface MatePostItemPorps {
  post: MatePostAllTypeForItem;
}
const supabase = createClient();

const MatePostItem = ({ post }: MatePostItemPorps) => {
  // const { geoData, isUseGeo } = locationStore();
  const router = useRouter();
  const { user } = useAuthStore();

  const handleStartChat = () => {
    startChat(post.user_id, user, router);
  };

  const handleLoginCheck = () => {
    if (user) {
      router.push(`/mate/posts/${post.id}`);
    }

    if (user === null) {
      router.push("/signin");
    }
  };

  return (
    <div className="rounded-[0.75rem] border px-4 py-[0.75rem] shadow-custom">
      <div onClick={handleLoginCheck} className="flex flex-col">
        {/* 첫번째 줄 */}
        <div className="flex items-center justify-between text-[0.625rem] text-[#A9A7A2]">
          <p className="">{post.created_at.split("T")[0]}</p>

          {post.distance !== null && <p className="">현위치에서 {post.distance.toFixed(1)}km 거리</p>}
        </div>

        {/* 두번째 줄 */}
        <div className="mt-[0.5rem] flex items-center justify-between gap-[2.87rem]">
          {/* 사용자 프로필 */}
          <div className="flex flex-col gap-[0.5rem]">
            <div className="h-[3.75rem] w-[3.75rem] shrink">
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
            <div className="rounded-full border border-mainColor bg-[#EAE3FC]">
              <p className="px-[0.62rem] py-[0.12rem] text-center text-[0.625rem] text-mainColor">
                {post.users[0]?.nickname}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col">
            {/* 본문 내용 */}
            <div>
              <div className="flex flex-col">
                <p className="w-[170px] overflow-hidden text-ellipsis whitespace-nowrap text-[1.125rem] font-semibold">
                  {post.title}
                </p>
                <div className="flex flex-col gap-y-[0.25rem]">
                  <div className="mt-[0.37rem] flex gap-[0.5rem]">
                    <img src="/assets/svg/ic_location2.svg" />
                    <p className="text-4 text-[#444447]">{post.place_name || ""}</p>
                  </div>
                  <div className="text-4 flex gap-[0.5rem] text-[#444447]">
                    <img src="/assets/svg/ic_calendar2.svg" />
                    <p className=""> {formatDateTimeContent(post.date_time)} </p>
                  </div>
                  <div className="flex gap-[0.5rem]">
                    <img src="/assets/svg/ic_user2.svg" className="" />
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
            
            <div className="flex">
              <Button
                className="w-full rounded-full bg-mainColor px-4 py-[0.5rem] text-center font-semibold text-white"
                onClick={handleStartChat}
                text="채팅하기"
              ></Button>
            </div>
          </div>
        </div>
      </div>

      {/* 채팅하기 버튼 */}
    </div>
  );
};

export default MatePostItem;
