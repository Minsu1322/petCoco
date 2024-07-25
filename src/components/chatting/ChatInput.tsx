"use client";
import React from "react";

const ChatInput = () => {
  const handleSendMessage = (text: string) => {
    alert(text);
    //call to supabase
    
  };

  return (
    <div className="p-5">
      <input
        type="text"
        placeholder="send message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
};

export default ChatInput;
