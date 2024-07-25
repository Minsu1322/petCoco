import { supabase } from "@/supabase/userClient";
import { User } from "@supabase/supabase-js";
import React from "react";

const ChatHeader = ({ user }: { user: User | undefined }) => {
  return (
    <div className="h-20">
      <div className="flex h-full items-center justify-between border-b p-5">
        <div>
          <h1 className="text-xl font-bold">Chatting</h1>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 animate-pulse rounded-full bg-green-500"></div>
            <h1 className="text-sm text-gray-400">2 onlines</h1>
          </div>
        </div>
        <button className="rounded-md border border-green-500 p-1">button</button>
      </div>
    </div>
  );
};

export default ChatHeader;
