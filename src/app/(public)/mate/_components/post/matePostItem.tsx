import { MatePostAllType } from "@/types/mate.type";
import Link from "next/link";
import ItemButton from "../itemButton";
import Image from "next/image";
import { getDistanceHaversine } from "../../getDistanceHaversine";
import { locationStore } from "@/zustand/locationStore";
import { getConvertTime } from "@/app/utils/getConvertTime";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/useAuth";
import { createClient } from "@/supabase/client";

interface MatePostItemPorps {
  post: MatePostAllType;
}
const supabase = createClient();

const MatePostItem = ({ post }: MatePostItemPorps) => {
  const { geoData, isUseGeo } = locationStore();
  const router = useRouter();
  const { user } = useAuthStore();

  const calculateDistance = () => {
    if (isUseGeo && geoData && post.position) {
      const distance = getDistanceHaversine({
        curPosition: geoData.center,
        desPosition: post.position.center
      });
      return distance.toFixed(1);
    }
    return null;
  };
  const distance = calculateDistance();

  const extractDong = (address: string) => {
    const match = address?.match(/(\S+동)(?=\s|$)/);
    return match ? match[0] : "";
  };

  //console.log(post);

  const startChat = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
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
    <div className="mb-5 rounded-xl border border-gray-300 p-5">
      <div className="mb-3 flex w-5/6 items-center justify-between">
        <div className="flex gap-x-2">
          <ItemButton
            text={post.recruiting ? "모집 중" : "모집 완료"}
            className={`${post.recruiting ? "bg-mainColor" : "bg-gray-300"} w-24 rounded-full px-4 py-2`}
          />
          <button
            className="flex h-11 w-24 items-center justify-center rounded-full border border-gray-400 p-3 text-center"
            onClick={startChat}
          >
            1:1 대화
          </button>
        </div>
        {distance !== null && <p className="mr-5 text-gray-500">현위치에서 {distance}km 거리</p>}
      </div>

      <Link href={`/mate/posts/${post.id}`} className="ml-3 mt-5 flex">
        <div className="flex-grow pr-5">
          <p className="mb-3 text-xl font-semibold">{post.title}</p>
          <p className="mb-3 h-24 overflow-hidden overflow-ellipsis whitespace-nowrap">{post.content}</p>
          <div className="mt-3 flex flex-row justify-between">
            <p>{post && post.users.nickname}</p>
            <div className="flex flex-row gap-x-5">
            <p className="w-28 overflow-hidden text-ellipsis whitespace-nowrap text-end">
                {`${extractDong(post.address || "")}, ${post.place_name || ""}`}
              </p>
              <p>
                {post.date_time?.split("T")[0]} | {getConvertTime({ date_time: post.date_time || "" })}
              </p>
              <p>{post.members}명 모집</p>
            </div>
          </div>
        </div>
        <div>
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN26a7CVa5ryzx5psOXRzK2a-OfomhbbUbw-zxRX7D835ImjsmTOc2tIgkc-LXQ2cFrf0&usqp=CAU"
            alt="사용자 프로필 이미지"
            width={140}
            height={140}
          />
        </div>
      </Link>
    </div>
  );
};

// api에서 글 user.id추출
// 1:1채팅 클릭시  user_id의 email랑 대화시작(함수?)
// components에 export로 구현
//
export default MatePostItem;
