import Chat from "@/components/chatting/Chat";
import { useRouter } from "next/router";

const ChatPage: React.FC = () => {
  const router = useRouter();
  const { id: otherUserId } = router.query;
  const currentUserId = "current-user-id"; // 실제로는 인증 시스템에서 가져와야 합니다

  if (typeof otherUserId !== "string") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Chat with User {otherUserId}</h1>
      <Chat currentUserId={currentUserId} otherUserId={otherUserId} />
    </div>
  );
};

export default ChatPage;
