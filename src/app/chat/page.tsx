"use client";

import { Box, Button, Slide, Stack, TextField, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useSocket } from "../../components/provider/SocketProvider";
import useMounted from "@/hooks/useMounted";
import { IMessage } from "@/types/chat";
import { useAuthStore } from "@/zustand/useAuth";

const Chat = () => {
  const { socket } = useSocket();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const { isMounted } = useMounted();
  const isLogin = !!user;

  const sendMessage = async () => {
    const username = user && user.name ? user.name : "Anonymous";
    const userId = user && user.id ? user.id : "unknown";

    if (currentMessage) {
      try {
        console.log("Sending message:", { username, userId, content: currentMessage });

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            userId,
            content: currentMessage
          }) // Ensure this is a JSON string
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error sending message:", errorText);
          alert("Failed to send message: " + errorText);
        } else {
          setCurrentMessage("");
        }
      } catch (error) {
        console.error("Error in fetch request:", error);
        alert("An unexpected error occurred while sending the message.");
      }
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("message", (message: IMessage) => {
        setMessages((prev) => [...prev, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off("message");
      }
    };
  }, [socket]);

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") sendMessage();
    };
    window.addEventListener("keyup", handleEnter);
    return () => window.removeEventListener("keyup", handleEnter);
  }, [currentMessage]);

  return (
    <Box>
      {messages.map((message, index) => (
        <Fragment key={index}>
          {user && message.userId === user.id ? (
            <Slide direction="left" in={isMounted} mountOnEnter unmountOnExit>
              <Box textAlign="end">
                <Typography
                  sx={{
                    display: "inline-block",
                    borderRadius: "0.5rem",
                    backgroundColor: "#BEF0AE",
                    padding: "0.5rem",
                    marginBottom: "1rem",
                    color: "black"
                  }}
                >
                  {message.content}
                </Typography>
              </Box>
            </Slide>
          ) : (
            <Slide direction="right" in={isMounted} mountOnEnter unmountOnExit>
              <Box>
                <Typography
                  sx={{
                    display: "inline-block",
                    borderRadius: "5px",
                    backgroundColor: "#746d69",
                    padding: "5px",
                    marginBottom: "1rem",
                    color: "white"
                  }}
                >
                  {message.content}
                </Typography>
              </Box>
            </Slide>
          )}
        </Fragment>
      ))}
      <Stack direction="row" justifyContent="center">
        <TextField
          size="small"
          id="content"
          disabled={!isLogin}
          placeholder={isLogin ? "Type message..." : "Login first"}
          variant="outlined"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <Button variant="outlined" disabled={!isLogin} onClick={sendMessage}>
          Send
        </Button>
      </Stack>
    </Box>
  );
};

export default Chat;
