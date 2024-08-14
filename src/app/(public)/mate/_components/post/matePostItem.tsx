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

  // const calculateDistance = () => {
  //   if (isUseGeo && geoData && post.position) {
  //     const distance = getDistanceHaversine({
  //       curPosition: geoData.center,
  //       desPosition: post.position.center
  //     });
  //     return distance.toFixed(1);
  //   }
  //   return null;
  // };
  // const distance = calculateDistance();

  // const extractDong = (address: string) => {
  //   const match = address?.match(/(\S+(?:동\d*가?|읍|면))(?=\s|$)/);
  //   return match ? match[0] : "";
  // };

  //console.log(post);
  const handleStartChat = () => {
    startChat(post.user_id, user, router);
  };

  const handleLoginCheck = () => {
    if (user) {
      router.push(`/mate/posts/${post.id}`);
    }

    if (user === null) {
      Swal.fire({
        title: "로그인이 필요합니다!",
        text: "산책메이트 상세페이지를 확인하기 위해서는 로그인이 필요합니다",
        icon: "warning"
      });
      router.push("/signin");
    }
  };

  return (
    <div className="mb-[1.5rem] flex flex-col rounded-xl border border-gray-300 px-[0.3rem] pb-[1rem] pt-[0.88rem] shadow-custom">
      <Link href={`/mate/posts/${post.id}`}>
        <div className="flex justify-between px-[1rem]">
          <p className="flex items-center text-xs text-gray-400">{post.created_at.split("T")[0]}</p>
          {post.distance !== null && (
            <p className="flex items-center text-xs text-gray-400">현위치에서 {post.distance.toFixed(1)}km 거리</p>
          )}
        </div>
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
              <p className="ml-[0.5rem] w-[145px] overflow-hidden text-ellipsis whitespace-nowrap text-sm">
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
      <div className="mx-[0.95rem] mt-[0.88rem] flex items-center justify-end">
        <Button
          className="flex flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-full bg-mainColor px-[3.88rem] py-[0.5rem] text-white"
          onClick={handleStartChat}
          text="채팅하기"
        ></Button>
      </div>
    </div>
  );
};

// api에서 글 user.id추출
// 1:1채팅 클릭시  user_id의 email랑 대화시작(함수?)
// components에 export로 구현
//
export default MatePostItem;
