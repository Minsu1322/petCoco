import Swal from "sweetalert2";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";

/**
 * 특정사용자랑 대화를 시작하는 함수
 * 사용자가 비로그인=로그인페이지로이동
 * 예문 : startChat(currentMate.users[0].id, user, router);

 * @param receiverId - 채팅상대의 ID
 * @param user - 현재로그인한 유저(auth이용)
 * @param router - navigation지정하면 됩니다
 *
 */
const startChat = async (receiverId: string, user: User | null, router: any) => {
  const supabase = createClient();

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
      .or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`)
      .limit(1);

    if (chatError) throw chatError;

    if (receiverId === user?.id) {
      Swal.fire({
        title: "자신에게 채팅을 시작할 수 없습니다.",
        text: "다른 사용자를 선택해 주세요.",
        icon: "warning",
        confirmButtonText: "확인"
      });
      return;
    }

    if (existingChat && existingChat.length > 0) {
      // 이미 채팅방이 존재하면 해당 채팅방으로 이동
      router.push(`/message?selectedUser=${receiverId}&openChat=true`);
    } else {
      // 새로운 채팅방 생성
      const { error: insertError } = await supabase.from("messages").insert([
        {
          sender_id: user.id,
          receiver_id: receiverId,
          content: "채팅이 시작되었습니다."
        }
      ]);

      if (insertError) throw insertError;

      // 새로 생성된 채팅방으로 이동
      router.push(`/message?selectedUser=${receiverId}&openChat=true`);
    }
  } catch (error) {
    console.error("채팅 시작 오류:", error);
    Swal.fire({
      title: "채팅 시작 오류",
      text: "채팅을 시작하는 데 문제가 발생했습니다. 다시 시도해 주세요.",
      icon: "error",
      confirmButtonText: "확인"
    });
  }
};

export default startChat;
