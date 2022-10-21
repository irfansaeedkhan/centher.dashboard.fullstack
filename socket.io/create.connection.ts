import { useEffect } from "react";
import { io } from "socket.io-client";

import { useNotificationsStore } from "@/store/notifications.store";
import { useSocketIOStore } from "@/store/socket.io.store";
import useUser from "@/hooks/use.user";
import { SOCKET_IO_URL } from "@/constants/common";

export const useCreateSocketIOConnection = () => {
  const { user } = useUser();
  const { socket, setSocket } = useSocketIOStore((state) => ({
    socket: state.socket,
    setSocket: state.setSocket,
  }));

  const { fetchNotifications } = useNotificationsStore((state) => ({
    fetchNotifications: state.fetchNotifications,
  }));

  useEffect(() => {
    if (!socket && user) {
      setSocket(io(SOCKET_IO_URL + "/?user_id=" + user._id));
      return;
    }

    if (socket) {
      socket.on("connect", () => {
        process.env.APP_ENV !== "production" && console.log("socket connected");
      });

      socket.on("disconnect", () => {
        process.env.APP_ENV !== "production" &&
          console.log("socket disconnected");
      });

      socket.on("notification", () => {
        process.env.APP_ENV !== "production" &&
          console.log("notification received");
        fetchNotifications();
      });
    }

    return () => {
      if (!socket) return;
      socket.off("connect");
      socket.off("disconnect");
      socket.off("notification");
    };
  }, [socket, setSocket, user, fetchNotifications]);
};
