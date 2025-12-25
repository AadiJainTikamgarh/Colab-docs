// import type { Socket } from "node:dgram"
import { Server, Socket } from "socket.io";

export const intiSocket = (io: Server) => {
  io.on("connected", (socket: Socket) => {
    console.log("Socket connected : ", socket.id);
  });

  io.on("disconnect", (socket: Socket) => {
    console.log("Socket Disconnected : ", socket.id);
  });
};
