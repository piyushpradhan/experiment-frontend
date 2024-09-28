import { io, Socket } from "socket.io-client";

const socketUrl = import.meta.env.VITE_BACKEND_URL;
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(socketUrl);
  }
  return socket;
};

