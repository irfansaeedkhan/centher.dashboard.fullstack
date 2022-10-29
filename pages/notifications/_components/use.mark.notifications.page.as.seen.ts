import { useEffect } from "react";

import useUser from "@/hooks/use.user";

export const useMarkNotificationsPageAsSeen = () => {
  const { user, updateUser } = useUser();

  useEffect(() => {
    if (user && !user.has_seen_notifications_page) {
      updateUser({
        has_seen_notifications_page: true,
      });
    }
  }, [updateUser, user]);
};
