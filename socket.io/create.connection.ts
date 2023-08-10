import { useEffect } from "react";
import { io } from "socket.io-client";
import { useSocketIOStore } from "@/store/socket.io.store";
import { useCountsStore } from "@/store/counts.store";
import useUser from "@/hooks/use.user";
import { SocketIoEvents } from "@/constants/socket-io-events";
import { CAPIBaseURL } from "@/constants/base-urls";

const BACKEND_WS_URL = CAPIBaseURL.split("http").join("ws");

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
      socket.on(SocketIoEvents.CONNECT, () => {
        process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
          console.log("socket connected");
      });

      socket.on(SocketIoEvents.DISCONNECT, () => {
        process.env.NEXT_PUBLIC_APP_ENV !== "production" &&
          console.log("socket disconnected");
      });

      socket.on(SocketIoEvents.NOTIFICATION, () => {
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
      socket.off(SocketIoEvents.CONNECT);
      socket.off(SocketIoEvents.DISCONNECT);
      socket.off(SocketIoEvents.NOTIFICATION);
    };
  }, [socket, setSocket, user, updateUser, fetchCounts]);
};
