import { MatePostAllTypeForItem } from "@/types/mate.type";
import Link from "next/link";
import Image from "next/image";
// import { getDistanceHaversine } from "../../getDistanceHaversine";
// import { locationStore } from "@/zustand/locationStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/useAuth";
import { createClient } from "@/supabase/client";
import { getConvertTime } from "@/app/utils/getConvertTime";
import Swal from "sweetalert2";
import Chip from "@/components/Chip";
import Button from "@/components/Button";

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

  const extractDong = (address: string) => {
    const match = address?.match(/(\S+(?:동\d*가?|읍|면))(?=\s|$)/);
    return match ? match[0] : "";
  };

  //console.log(post);
  const startChat = async () => {
    if (!user) {
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
        icon: "error"
      });
    }
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
    <div className="shadow-custom mx-[1rem] mb-5 flex flex-col rounded-xl border border-gray-300 pb-[1rem] pt-[0.88rem]">
      <div className="flex justify-between px-[1rem]">
        <p className="flex items-center text-xs text-gray-400">{post.created_at.split("T")[0]}</p>
        {post.distance !== null && (
          <p className="flex items-center text-xs text-gray-400">현위치에서 {post.distance.toFixed(1)}km 거리</p>
        )}
      </div>
      <div className="mt-[0.75rem] flex">
        <div className="mt-[0.5rem] ml-[2.4rem] mr-[2.28rem] flex flex-col items-center">
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
            <p className="w-15 overflow-hidden text-ellipsis whitespace-nowrap text-[0.625rem] text-gray-400">
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
      </div>
      <div className="mx-auto mt-[0.88rem] flex items-center">
        <Button
          className="mr-[0.75rem] flex flex-shrink-0 flex-col items-center justify-center rounded-full bg-gray-300 px-[2.78rem] py-[0.5rem]"
          onClick={startChat}
          text="채팅하기"
        ></Button>
        <Link
          className="flex flex-shrink-0 flex-col items-center justify-center rounded-full bg-gray-300 p-2.5 px-[2.25rem] py-[0.5rem]"
          href={`/mate/posts/${post.id}`}
        >자세히 보기</Link>
      </div>
    </div>
  );
};

// api에서 글 user.id추출
// 1:1채팅 클릭시  user_id의 email랑 대화시작(함수?)
// components에 export로 구현
//
export default MatePostItem;
