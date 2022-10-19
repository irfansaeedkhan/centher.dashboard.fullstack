import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import { useSocketIOStore } from "@/store/socket.io.store";
import useUser from "@/hooks/use.user";
import { SOCKET_IO_URL } from "@/constants/common";

export const useCreateSocketIOConnection = () => {
  const { user } = useUser();
  const { socket, setSocket } = useSocketIOStore((state) => ({
    socket: state.socket,
    setSocket: state.setSocket,
  }));

  useEffect(() => {
    if (!socket && user) {
      setSocket(io(SOCKET_IO_URL + "/?user_id=" + user._id));
      return;
    }

    if (socket) {
      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on("disconnect", () => {
        console.log("disconnected");
      });
    }

    return () => {
      if (!socket) return;
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket, setSocket, user]);
};
