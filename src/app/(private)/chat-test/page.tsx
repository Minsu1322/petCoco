"use client";
import Chat from "@/components/chatting/Chat";
import { useState } from "react";

const ChatTest = () => {
  const [userId, setUserId] = useState("user1");
  const [otherId, setOtherId] = useState("user2");

  return (
    <div>
      <div>
        <label>
          Current User ID:
          <input value={userId} onChange={(e) => setUserId(e.target.value)} />
        </label>
        <label>
          Other User ID:
          <input value={otherId} onChange={(e) => setOtherId(e.target.value)} />
        </label>
      </div>
      <Chat currentUserId={userId} otherUserId={otherId} />
    </div>
  );
};

export default ChatTest;
