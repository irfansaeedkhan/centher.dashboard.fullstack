import { useEffect } from "react";
import { io } from "socket.io-client";

import { useSocketIOStore } from "@/store/socket.io.store";
import {
  Notification,
  useNotificationsStore,
} from "@/store/notifications.store";
import useUser from "@/hooks/use.user";
import { SOCKET_IO_URL } from "@/constants/common";

export const useCreateSocketIOConnection = () => {
  const { user } = useUser();
  const { socket, setSocket } = useSocketIOStore((state) => ({
    socket: state.socket,
    setSocket: state.setSocket,
  }));
  const addNotification = useNotificationsStore(
    (state) => state.addNotification
  );

  useEffect(() => {
    if (!socket && user) {
      setSocket(io(SOCKET_IO_URL + "/?user_id=" + user._id));
      return;
    }

    if (socket) {
      socket.on("connect", () => {
        process.env.NODE_ENV !== "production" &&
          console.log("socket connected");
      });

      socket.on("disconnect", () => {
        process.env.NODE_ENV !== "production" &&
          console.log("socket disconnected");
      });

      socket.on("notification", (notification: Notification) => {
        addNotification(notification);
      });
    }

    return () => {
      if (!socket) return;
      socket.off("connect");
      socket.off("disconnect");
      socket.off("notification");
    };
  }, [socket, setSocket, user, addNotification]);
};
