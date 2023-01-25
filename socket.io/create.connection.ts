import { useEffect } from "react";
import { io } from "socket.io-client";

import { useSocketIOStore } from "@/store/socket.io.store";
import { useCountsStore } from "@/store/counts.store";
import useUser from "@/hooks/use.user";
import { getBackendUrl } from "@/constants/common";

const BACKEND_WS_URL = getBackendUrl("ws", "frontend-to-backend");

export const useCreateSocketIOConnection = () => {
  const { user, updateUser } = useUser();
  const { socket, setSocket } = useSocketIOStore((state) => ({
    socket: state.socket,
    setSocket: state.setSocket,
  }));

  const { fetchCounts } = useCountsStore((state) => ({
    fetchCounts: state.fetchCounts,
  }));

  useEffect(() => {
    if (!socket && user) {
      setSocket(io(BACKEND_WS_URL + "/?user_id=" + user._id));
      return;
    }

    if (socket) {
      socket.on("connect", () => {
        process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
          console.log("socket connected");
      });

      socket.on("disconnect", () => {
        process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
          console.log("socket disconnected");
      });

      socket.on("notification", () => {
        process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
          console.log("notification received");
        fetchCounts();
        updateUser({
          has_seen_notifications_page: false,
        });
      });
    }

    return () => {
      if (!socket) return;
      socket.off("connect");
      socket.off("disconnect");
      socket.off("notification");
    };
  }, [socket, setSocket, user, updateUser, fetchCounts]);
};
