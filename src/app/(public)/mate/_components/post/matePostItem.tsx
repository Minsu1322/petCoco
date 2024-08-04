import { MatePostAllTypeForItem } from "@/types/mate.type";
import Link from "next/link";
import Image from "next/image";
// import { getDistanceHaversine } from "../../getDistanceHaversine";
// import { locationStore } from "@/zustand/locationStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/useAuth";
import { createClient } from "@/supabase/client";
import { getConvertTime } from "@/app/utils/getConvertTime";

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
      alert("로그인이 필요합니다.");
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
      alert("채팅을 시작하는 데 문제가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="mb-5 w-[48%] rounded-xl border border-gray-300 px-4 pb-2 pt-1">
      <div className="mb-3 flex h-16 flex-row items-center justify-between border-b-2">
        <div className=" flex gap-2 h-10 items-center">
          <div
            className={`${post.recruiting ? "bg-mainColor" : "bg-gray-300"} w-18 flex h-10 items-center justify-center rounded-md px-8 py-2`}
          >
            {post.recruiting ? "모집 중" : "모집 완료"}
          </div>
          <p className="ml-2 flex h-10 items-center justify-center font-semibold">{post.members}명 모집</p>
        </div>
        {post.distance !== null && (
          <p className="flex h-10 items-center text-sm text-gray-500">현위치에서 {post.distance.toFixed(1)}km 거리</p>
        )}
      </div>
      <Link href={`/mate/posts/${post.id}`} className="mt-5">
        <div className="mb-4 mt-2 flex w-full flex-row justify-between">
          <div className="flex h-32 w-8/12  flex-col gap-y-2 pr-4">
            <p className="mb-3 text-xl w-full overflow-hidden text-ellipsis whitespace-nowrap font-semibold">{post.title}</p>
            <p className="mb-3 line-clamp-3 h-24 overflow-hidden text-ellipsis">{post.content}</p>
          </div>
          <div className="w-4/12">
          <Image
            src={
              post.users[0]?.profile_img ||
              "https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/post_image/1722324396777_xo2ka9.jpg"
            }
            alt="사용자 프로필 이미지"
            width={120}
            height={60}
            className="rounded-md object-cover w-full h-32"
          />
          </div>
        </div>
      </Link>
      <div className="mt-3 flex flex-row items-end justify-between">
        <div
          className="flex cursor-pointer flex-row items-center gap-x-1 rounded-lg px-1 hover:bg-sky-200"
          onClick={startChat}
        >
          <img src="/assets/svg/mail-alt.svg" className="h-5 w-5" alt="메일 아이콘" />
          <p className="w-15 overflow-hidden text-ellipsis whitespace-nowrap">{post.users[0]?.nickname}</p>
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="w-36 overflow-hidden text-ellipsis whitespace-nowrap text-end text-sm">
            {`${extractDong(post.address || "")}, ${post.place_name || ""}`}
          </p>
          <p className="text-end text-sm">
            {post.date_time?.split("T")[0]} {getConvertTime({ date_time: post.date_time || "" })}
          </p>
        </div>
      </div>
    </div>
  );
};

// api에서 글 user.id추출
// 1:1채팅 클릭시  user_id의 email랑 대화시작(함수?)
// components에 export로 구현
//
export default MatePostItem;
