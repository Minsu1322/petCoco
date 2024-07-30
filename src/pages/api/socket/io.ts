import { Server as NetServer } from "http";
import { Socket } from "net";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";

import { ServerToClientEvents } from "@/types/socket";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIO<ServerToClientEvents>;
    };
  };
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    try {
      const httpServer = res.socket.server as NetServer;
      const io = new ServerIO(httpServer, {
        path: "/api/socket/io",
        addTrailingSlash: false
      });

      res.socket.server.io = io;
      console.log("Socket.io server initialized");
    } catch (error) {
      console.error("Error initializing Socket.io server:", error);
      res.status(500).end("Error initializing Socket.io server");
      return;
    }
  } else {
    console.log("Socket.io server already initialized");
  }

  res.end();
};

export default ioHandler;
