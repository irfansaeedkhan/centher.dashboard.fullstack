import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { io } from "socket.io-client";

export interface SocketIOStore {
  socket: ReturnType<typeof io> | null;
  setSocket: (socket: ReturnType<typeof io>) => void;
}

export const useSocketIOStore = create<SocketIOStore>()(
  devtools(
    (set) => ({
      socket: null,
      setSocket: (socket: ReturnType<typeof io>) => set({ socket }),
    }),
    { name: "SocketIOStore" }
  )
);
