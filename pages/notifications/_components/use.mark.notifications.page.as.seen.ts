import { useEffect } from "react";

import { useNotificationsStore } from "@/store/notifications.store";
import useUser from "@/hooks/use.user";

export const useMarkNotificationsPageAsSeen = () => {
  const { user, updateUser } = useUser();
  const { markAllAsRead } = useNotificationsStore();

  useEffect(() => {
    if (user && !user.has_seen_notifications_page) {
      updateUser({
        has_seen_notifications_page: true,
      });
      markAllAsRead();
    }
  }, [user, updateUser, markAllAsRead]);
};
