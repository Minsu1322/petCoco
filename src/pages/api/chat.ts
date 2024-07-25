import { NextApiRequest, NextApiResponse } from "next";
import { IMessage } from "@/types/chat";
import { NextApiResponseServerIO } from "./socket/io";

const chatHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    try {
      // Check if req.body is a string and parse it
      let message: IMessage;
      if (typeof req.body === "string") {
        message = JSON.parse(req.body);
      } else {
        message = req.body;
      }

      // Check if username is provided
      if (!message.username || !message.userId || !message.content) {
        console.error("Invalid message format:", message);
        throw new Error("Invalid message format");
      }

      // dispatch to channel "message"
      if (res.socket.server.io) {
        res.socket.server.io.emit("message", message);
      } else {
        throw new Error("Socket server not initialized");
      }

      // return message
      res.status(201).json(message);
    } catch (error) {
      console.error("Error handling message:", error);
      res.status(500).json({ error: "Internal Server Error", details: error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default chatHandler;
